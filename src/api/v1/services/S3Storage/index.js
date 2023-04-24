require('dotenv').config({ path: './src/config/.env' });

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const { getSignedUrl }  = require('@aws-sdk/s3-request-presigner');

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
})

exports.uploadFile = async (file, randomImageName) => {

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: randomImageName,
        Body: file.buffer,
        ContentType: file.mimetype
    })

    return await s3.send(command);
}

exports.downloadFile = async (fileName) => {

    const getObjectParams = {
        Bucket: bucketName,
        Key: fileName
    }
    
    const command = new GetObjectCommand(getObjectParams);

    return await getSignedUrl(s3, command, { expiresIn: 3600 });
}

exports.deleteFile = async (fileName) => {
    const params = {
        Bucket: bucketName,
        Key: fileName
    }

    const command = new DeleteObjectCommand(params);

    return await s3.send(command);
}