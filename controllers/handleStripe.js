const CustomError = require('../errors/customError.js');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const User = require('../models/User.js');
const Project = require('../models/Project.js');
const crypto = require('crypto');
const { Console } = require('console');


// Create a customer account if it doesn't already exist
const createOrRetrieveCustomer = async (email, fullName) => {
    // Check if a customer with the provided email already exists
    const existingCustomers = await stripe.customers.list({ email });

    if (existingCustomers.data.length > 0) {
        // Customer with the email already exists, return the first customer found
        return existingCustomers.data[0];
    } else {
        // Create a new customer account with the email
        const customer = await stripe.customers.create({ email, name: fullName });
        return customer;
    }
};

// Add funds to a user's wallet (customer)
const addFunds = async (customerId, amount) => {
    await stripe.customers.update(customerId, { balance: amount });
};

// Make a payment from one user to another
const makePayment = async (senderCustomerId, recipientCustomerId, amount) => {
    const sender = await stripe.customers.retrieve(senderCustomerId);
    const recipient = await stripe.customers.retrieve(recipientCustomerId);

    if (sender.balance < amount) {
        throw new Error('Insufficient funds');
    }

    const senderNewBalance = sender.balance - amount;
    const recipientNewBalance = recipient.balance + amount;

    await stripe.customers.update(senderCustomerId, { balance: senderNewBalance });
    await stripe.customers.update(recipientCustomerId, { balance: recipientNewBalance });
};


const chargeStripe = async (req, res, next) => {
    const { token, amount, projectId } = req.body;

    const tokenId = token.id;

    try {
        const addFunds = await stripe.charges.create({
            amount,
            currency: 'USD',
            source: tokenId,
            description: 'TeamedApp charge to Customer',
        });

        if (addFunds) {
            await Project.findOneAndUpdate({ _id: projectId }, { $set: { isPaymentVerified: true, receivedAmount: (amount / 100) } });
            const balance = await stripe.balance.retrieve();
            return res.success(201, 'Stripe charge successful');
        } else {
            return next(new CustomError("Payment Not Verified Successfully"));
        }
    } catch (error) {
        console.error("Stripe Charge Error:", error);
        return next(new CustomError("An error occurred while processing the payment"));
    }
}


const sendAmountToBankAccount = async (req, res, next) => {

    try {

        const { projectId } = req.body;

        const projectFound = await Project.findOne({ _id: projectId });

        let transferableAmount = projectFound?.actualRate ?? projectFound?.maxRate;

        if (transferableAmount >= projectFound?.receivedAmount)
            return next(new CustomError('Amount has not been paid in full for this project', 401));

        const projectCreative = await User.findOne({ _id: projectFound?.creativeId })
        if (!projectCreative?.stripeAccountId)
            return next(new CustomError('This User has no Stripe Account Register', 401));

        if (!projectFound?._id)
            return next(new CustomError('Its hard to Find Project', 401));

        if (!projectFound.isPaymentVerified)
            return next(new CustomError('Your Payment is not Verified', 401));

        if (projectFound?.isPaymentTransfer)
            return res.success(201, 'Amount Already Transfer to creative');

        if (projectFound.creatorId != req?.userId)
            return next(new CustomError('Your are not Associate with this project', 401));

        const maxRateInDollars = transferableAmount;
        const fivePercent = maxRateInDollars * 0.05;
        const amountWithFee = maxRateInDollars - fivePercent + 0.3;
        const amountInCents = Math.round(amountWithFee * 100);

        if (amountInCents < 10)
            return next(new CustomError('transferable amount is very low', 401))

        const response = await stripe.transfers.create({
            amount: amountInCents,
            currency: 'usd',
            destination: projectCreative?.stripeAccountId,
        });


        if (response) {
            const resp = await Project.findOneAndUpdate({ _id: projectId }, { $set: { isPaymentTransfer: true, status: "completed", netAmountTransferToCreative: amountWithFee } });

            return res.success(201, `${projectFound?.maxRate} dollars Transfer To Creative Successfully`);
        }
        else
            return next(new CustomError('Some Thing went Wrong 5', 401));

    } catch (err) {
        console.error('Error making a payout:', err);
        return next(new CustomError('Some Thing went Wrong', 401));
    }


};



const showStripe = async (req, res, next) => {
    const { code } = req.body
    const authorizationCode = code;

    try {
        if (authorizationCode) {
            stripe.oauth.token({
                grant_type: 'authorization_code',
                code: authorizationCode,
            }, async (err, response) => {
                if (err) {
                    console.error(err);
                    return next(new CustomError('Authentication Failed', 401))
                } else {
                    // console.log('Access Token:', response.access_token);
                    // console.log('Refresh Token:', response.refresh_token);
                    console.log('response.stripe_user_id', response?.stripe_user_id);
                    const encryptStripeId = response?.stripe_user_id
                    await User.findOneAndUpdate({ _id: req?.userId }, { $set: { stripeAccountId: encryptStripeId } })
                    return res.success(201, 'verify Account Successfully')
                }
            });
        } else {
            return next(new CustomError('Credentials Missing', 401))
        }
    } catch (err) {
        console.log('err')
    }
}




module.exports = { chargeStripe, createOrRetrieveCustomer, sendAmountToBankAccount, showStripe }


