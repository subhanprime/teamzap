const Project = require('../models/Project');
const CustomError = require("../errors/customError.js");
const { uploadFile } = require("../aws/aws.js");
const User = require('../models/User.js');
const { default: mongoose } = require('mongoose');
// const mongoose = require('mongoose');

const createProjects = async (req, res, next) => {
    try {
        

        const files = req?.files?.files || [];
        const inspiration = req?.files?.inspiration || [];
        const { skillsRequired, title, description, startDate, endDate, isUrgent, minRate, maxRate, } = req.body;

        if (!skillsRequired || !title || !description || !startDate || !endDate || !minRate || !maxRate)
            return next(new CustomError("Please Provide all Fields Properly", 401));

        const uploadedUrls = [];
        if (files || files.length >= 0) {
            for (const file of files) {
                let type;
                if (file?.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') type = "DOCX";
                else if (file?.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') type = "PPTX";
                else if (file?.mimetype == 'application/pdf') type = "application/pdf";
                else if (file?.mimetype == 'video/mp4') type = "video/mp4";
                else if (file?.mimetype == 'image/jpeg') type = "image/jpeg";
                else if (file?.mimetype == 'image/png') type = "image/png";
                else type = "unknown";
                const url = await uploadFile(file.buffer);
                uploadedUrls.push({ fileType: type, url });
            }
        }


        const inspirationUrls = [];
        if (inspiration || inspiration.length >= 0) {
            for (const file of inspiration) {
                let type;
                if (file?.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') type = "DOCX";
                else if (file?.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') type = "PPTX";
                else if (file?.mimetype == 'application/pdf') type = "application/pdf";
                else if (file?.mimetype == 'video/mp4') type = "video/mp4";
                else if (file?.mimetype == 'image/jpeg') type = "image/jpeg";
                else if (file?.mimetype == 'image/png') type = "image/png";
                else type = "unknown";
                const url = await uploadFile(file.buffer);
                inspirationUrls.push({ fileType: type, url });
            }
        }

        const newProject = new Project({
            skillsRequired,
            title,
            description,
            startDate,
            endDate,
            isUrgent,
            minRate,
            maxRate,
            status: 'open',
            creatorId: req?.userId,
            files: uploadedUrls,
            inspiration: inspirationUrls,
        });
        const response = await newProject.save();

        await User.findOneAndUpdate({ _id: req?.userId }, { $push: { projects: response?._id } })
        if (response)
            res.success(201, "Project created successfully", { project: newProject })
        else
            return next(new CustomError("Project created Failed", 401));

    } catch (err) { console.log(err) }
}


const createSpecificProject = async (req, res, next) => {
    try {


        const files = req?.files?.files || [];
        const inspiration = req?.files?.inspiration || [];
        const { skillsRequired, title, description, startDate, endDate, isUrgent, minRate, maxRate, creativeId } = req.body;

        if (!skillsRequired || !title || !description || !startDate || !endDate || !minRate || !maxRate || !creativeId)
            return next(new CustomError("Please Provide all Fields Properly", 401));

        const uploadedUrls = [];
        if (files || files.length >= 0) {
            for (const file of files) {
                let type;
                if (file?.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') type = "DOCX";
                else if (file?.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') type = "PPTX";
                else if (file?.mimetype == 'application/pdf') type = "application/pdf";
                else if (file?.mimetype == 'video/mp4') type = "video/mp4";
                else if (file?.mimetype == 'image/jpeg') type = "image/jpeg";
                else if (file?.mimetype == 'image/png') type = "image/png";
                else type = "unknown";
                const url = await uploadFile(file.buffer);
                uploadedUrls.push({ fileType: type, url });
            }
        }


        const inspirationUrls = [];
        if (inspiration || inspiration.length >= 0) {
            for (const file of inspiration) {
                let type;
                if (file?.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') type = "DOCX";
                else if (file?.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') type = "PPTX";
                else if (file?.mimetype == 'application/pdf') type = "application/pdf";
                else if (file?.mimetype == 'video/mp4') type = "video/mp4";
                else if (file?.mimetype == 'image/jpeg') type = "image/jpeg";
                else if (file?.mimetype == 'image/png') type = "image/png";
                else type = "unknown";
                const url = await uploadFile(file.buffer);
                inspirationUrls.push({ fileType: type, url });
            }
        }


        const newProject = new Project({
            skillsRequired,
            title,
            description,
            startDate,
            endDate,
            isUrgent,
            minRate,
            maxRate,
            status: 'pending',
            creatorId: req?.userId,
            files: uploadedUrls,
            creativeId: new mongoose.Types.ObjectId(creativeId),
            inspiration: inspirationUrls,
        });

        const response = await newProject.save();

        await User.findOneAndUpdate({ _id: req?.userId }, { $push: { projects: response?._id } })
        if (response)
            res.success(201, "Project created successfully", { project: newProject })
        else
            return next(new CustomError("Project created Failed", 401));

    } catch (err) {
        console.log(err)
    }

}


module.exports = { createProjects, createSpecificProject }