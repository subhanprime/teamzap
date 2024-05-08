const CustomError = require('../errors/customError.js');
const Messages = require('../models/Messages.js');
const mongoose = require("mongoose")
const createMessages = async (req, res, next) => {
    const { conversationId, projectId, text, senderId } = req.body;

    if (!conversationId || !projectId || !text || !senderId)
        return next(new CustomError("Please Provide All Fields", 401));
    const response = await Messages.create({ conversationId, projectId, text, senderId });

    if (response)
        return res.success(201, "Create Messages Successfully", response);
    else
        return next(new CustomError("Some Thing Went Wrong", 401));

}

const getMessages = async (req, res, next) => {
    const { conversationId, page } = req.query;
    const itemsPerPage = 100;

    if (!conversationId)
        return next(new CustomError("Please Provide a Conversation ID", 400));

    const pageNum = parseInt(page, 10) || 1;


    const messages = await Messages.aggregate([
        {
            $match: {
                conversationId: new mongoose.Types.ObjectId(conversationId),
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: (pageNum - 1) * itemsPerPage,
        },
        {
            $limit: itemsPerPage,
        },
        { "$set": { "message": "$text" } },
        {
            "$unset": ["_id", "conversationId", "__v", "projectId","text"]
        },

        {
            "$sort":{createdAt:1}
        }
    ]);

    const totalMessagesCount = await Messages.countDocuments({
        conversationId: new mongoose.Types.ObjectId(conversationId),
    });

    const totalPages = Math.ceil(totalMessagesCount / itemsPerPage);

    return res.success(200, "Get Messages Successfully", {
        messages,
        totalPages,
    });

};



module.exports = { createMessages, getMessages };