const CustomError = require('../errors/customError.js');
const Conversation = require('../models/Conversations.js');
const createConversation = async (req, res, next) => {
    const { creativeId, athleteId } = req.body;

    if (!creativeId || !athleteId)
        return next(new CustomError("Please Provide All Fields", 401));
    const response = await Conversation.create({
        conversation:
        {
            creative: creativeId,
            athlete: athleteId,
        },

    });

    if (response)
        return res.success(201, "Create Conversation Successfully", response);
    else
        return next(new CustomError("Some Thing Went Wrong", 401));

}


const getConversation = async (req, res, next) => {
    const { creativeId, athleteId } = req.query;

    if (!creativeId || !athleteId)
        return next(new CustomError("Please Provide Both CreativeId and AthleteId", 400));

    const conversation = await Conversation.findOne({
        "conversation.creative": creativeId,
        "conversation.athlete": athleteId,
    }).select({
        "_id": 0,
        "conversation_Id": "$_id"
    });

    if (!conversation) {
        return next(new CustomError("Conversation not found", 404));
    }

    return res.success(200, "Get Conversation Successfully", conversation);
};


module.exports = { createConversation, getConversation };