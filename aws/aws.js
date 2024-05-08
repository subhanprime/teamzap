const S3 = require('aws-sdk/clients/s3.js');
const message = require('aws-sdk/lib/maintenance_mode_message.js');

const crypto = require('crypto')
message.suppress = true;

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME, REGION_KEY } = process.env;

// console.log(ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME, REGION_KEY);

const s3 = new S3({
    region: REGION_KEY,
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
});


const uploadFile = async (fileKey) => {
    try {
        const randomImageName = (bytes = 32) =>
            crypto.randomBytes(bytes).toString("hex");
        const imageName = randomImageName();
        const params = {
            Bucket: BUCKET_NAME,
            Body: fileKey,
            Key: imageName,
        };
        const result = await s3.upload(params).promise();
        return `${process.env.CLOUD_FRONT_API}/${result?.Key}`;
    } catch (err) {
        console.log("error in upload file on AWS", err);
    }
}

const getAwsFile = async (fileKey) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileKey,
        };
        const result = await s3.getSignedUrl("getObject", params);
        return result;
    } catch (err) {
        console.log("error in get file from AWS", err);

    }
}

const deleteAwsFile = async (file) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: file,
        };
        return s3.deleteObject(params).promise();
    } catch (err) {
        console.log("error in delete file from AWS", err);
    }
}



module.exports = { uploadFile, getAwsFile, deleteAwsFile }