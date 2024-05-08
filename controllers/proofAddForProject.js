const Project = require('../models/Project.js');
const CustomError = require('../errors/customError.js');
const { uploadFile } = require('../aws/aws.js');

const proofAddForProject = async (req, res, next) => {
    const files = req.files;
    const { projectId } = req.body;

    if (!projectId) {
        return next(
            new CustomError("Please Provide Project ID", 401)
        );
    }

    let uploadedUrls = [];

    if (files && files.length > 0) {
        for (const file of files) {
            let type;
            if (file?.mimetype == 'image/jpeg') type = "image/jpeg";
            else if (file?.mimetype == 'image/png') type = "image/png";
            else {
                return res.status(400).json({ "message": "Invalid file type" });
            }
            if (type) {
                const url = await uploadFile(file.buffer);
                uploadedUrls.push({ fileType: type, url });
            }
        }
    } else {
        return next(
            new CustomError("Please Add Proof to Insert in Project.", 401)
        );
    }

    try {
        const response = await Project.findOneAndUpdate(
            { _id: projectId, creativeId: req.userId },
            { $push: { proofs: { $each: uploadedUrls } } },
            { new: true }
        );
        if (response)
            return res.success(201, "Add Proof in Project Successfully");
    } catch (error) {
        return next(new CustomError("Failed to update the project", 400));
    }
}

module.exports = { proofAddForProject }
