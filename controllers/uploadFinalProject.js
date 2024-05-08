const CustomError = require('../errors/customError.js');
const Project = require('../models/Project.js');
const { uploadFile } = require('../aws/aws.js');

const uploadFinalProject = async (req, res, next) => {

    try {
        const { projectId } = req.body
        const file = req.file;
        let fileUrl = '';

        if (file && (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip'))) {
            fileUrl = await uploadFile(file.buffer);

            const updateProject = await Project.findOneAndUpdate(
                { _id: projectId },
                { $push: { finalProjects: { fileUrl, fileName: file.originalname } } }
            )

            if (updateProject) {
                return res.status(201).json({ success: true, message: "Upload final project successful" });
            } else {
                throw new CustomError("Upload failed", 400);
            }
        } else {
            throw new CustomError("Invalid file format. Only ZIP files are allowed.", 400);
        }

    } catch (error) {
        next(error);
    }
};

module.exports = { uploadFinalProject };
