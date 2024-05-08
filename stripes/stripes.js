const secretApi = 'sk_test_51NzwvsLwd4YfrfgoBIxAZIMUFpJqVsS7bnTphUhEVNQZ3zKXKZZhySYu8d9bLhzDTVOsLlAeEH8sqarEWQg7kRRo00o3gWnawo'; // Replace with your Stripe secret API key
const stripe = require('stripe')(secretApi);


// Example usage
async function main() {
    // Create or retrieve user accounts by email
    const user1 = await createOrRetrieveCustomer('user1@example.com');
    const user2 = await createOrRetrieveCustomer('user2@example.com');

    // Add initial funds
    await addFunds(user1.id, 10000); // User 1 has $100.00
    await addFunds(user2.id, 5000);  // User 2 has $50.00

    // Transfer funds
    const amountToSend = 3000; // $30.00
    await makePayment(user1.id, user2.id, amountToSend);

    // Verify balances
    const updatedUser1 = await stripe.customers.retrieve(user1.id);
    const updatedUser2 = await stripe.customers.retrieve(user2.id);

    console.log('User 1 Balance:', updatedUser1.balance);
    console.log('User 2 Balance:', updatedUser2.balance);
}

main();





// const secretApi = 'sk_test_51NzwvsLwd4YfrfgoBIxAZIMUFpJqVsS7bnTphUhEVNQZ3zKXKZZhySYu8d9bLhzDTVOsLlAeEH8sqarEWQg7kRRo00o3gWnawo'; // Replace with your Stripe secret API key
// const stripe = require('stripe')(secretApi);

// // Step 1: Create connected accounts for users
// async function createConnectedAccount(email, type) {
//     const account = await stripe.accounts.create({
//         type: 'standard', // You can specify 'standard' or 'express' based on your requirements.
//         email,
//     });

//     return account;
// }

// // Step 2: Create a Payment Intent (transaction) for a user
// async function createPaymentIntent(senderAccountId, recipientAccountId, amount) {
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount, // Amount in cents
//         currency: 'usd',
//         transfer_group: 'group_key', // A unique identifier for the transfer group
//         application_fee_amount: 100, // Stripe fee (adjust as needed)
//         on_behalf_of: recipientAccountId, // The connected account to receive the funds
//         transfer_data: {
//             destination: recipientAccountId, // The connected account to receive the funds
//         },
//     });

//     return paymentIntent;
// }

// // Step 3: Confirm the Payment Intent
// async function confirmPaymentIntent(paymentIntentId) {
//     const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
//     return confirmedPaymentIntent;
// }

// // Example usage
// async function main() {
//     // Step 1: Create connected accounts for users
//     const user1 = await createConnectedAccount('user1@example.com', 'standard');
//     const user2 = await createConnectedAccount('user2@example.com', 'standard');
//     console.log('user1', user1, 'user2222222', user2)
//     // // Step 2: Create a Payment Intent for the funds transfer
//     // const paymentAmount = 1000; // $10.00
//     // const paymentIntent = await createPaymentIntent(user1.id, user2.id, paymentAmount);

//     // // Step 3: Confirm the Payment Intent
//     // const confirmedPaymentIntent = await confirmPaymentIntent(paymentIntent.id);

//     // console.log('Payment completed:', confirmedPaymentIntent.status);
// }

// main();
