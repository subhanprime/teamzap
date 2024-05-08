const Project = require('../models/Project.js');
const CustomError = require('../errors/customError.js');
const mongoose = require('mongoose');

const deleteProjects = async (req, res, next) => {
    const { projectId } = req.params;
    const response = await Project.deleteOne({ _id: projectId, status: "open" });

    if (response.deletedCount === 1)
        return res.success(201, 'Project Deleted Successfully', true);
    else
        return next(new CustomError("No Project For Delete", 401));

};


const specificCompleted = async (req, res, next) => {


    const response = await Project.aggregate([

        {
            $match: {
                status: "completed",
                creativeId: new mongoose.Types.ObjectId(req.userId)
            }
        }
    ])
    return res.success(201, 'Completed Project By User', response);

}


module.exports = { deleteProjects, specificCompleted }