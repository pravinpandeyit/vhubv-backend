const envConfig = require("../config/env.config.js");
const currencySymbol = envConfig.CURRENCY_SYMBOL;
const CUSTOM_FORMAT = envConfig.CUSTOM_FORMAT;
const DATE_FORMAT = 'MM-DD-YYYY';
const moment = require('moment');
const crypto = require("crypto");
const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");
const { logger } = require("handlebars");


// Set the required AWS S3 bucket configuration parameters:
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketURL = "https://" + bucketName + '.s3.' + bucketRegion + '.amazonaws.com/'


// Create an S3 client with the required credentials:
const s3 = new S3Client({
    credentials: { accessKeyId: accessKey, secretAccessKey: secretAccessKey },
    region: bucketRegion,
});

// Create a function to generate a random image name using crypto:
const randomImageName = (bytes = 8) =>
    crypto.randomBytes(bytes).toString("hex");


const updateAndFind = async (Model, dataToUpdate, queryOptions, attributes) => {
    const existUser = await Model.findOne({
        ...queryOptions,
        attributes: attributes,
    });

    if(!existUser){
        await Model.create(dataToUpdate);
    }else{
        await Model.update(dataToUpdate, queryOptions);
    }
    const updatedUser = await Model.findOne({
        ...queryOptions,
        attributes: attributes,
    });
    return updatedUser;
};

// date formate 

const formatDateAndTime = (data, dateColumns, dateTimeColumns) => {
    return data.map(item => {
        console.log("Before Formatting:", JSON.stringify(item, null, 2)); // Debugging

        dateColumns.forEach(column => {
            if (item[column]) { 
                console.log(`Processing date column ${column}:`, item[column]); // Log values
                const date = moment.utc(item[column], "YYYY-MM-DD", true);
                
                if (date.isValid()) {
                    item[column] = date.format("YYYY-MM-DD");
                } else {
                    console.error(`Invalid date format for column ${column}:`, item[column]);
                }
            }
        });

        dateTimeColumns.forEach(column => {
            if (item[column]) {
                console.log(`Processing date-time column ${column}:`, item[column]); // Log values
                const date = moment.utc(item[column], "YYYY-MM-DD HH:mm:ss", true);
                
                if (date.isValid()) {
                    item[column] = date.format("YYYY-MM-DD HH:mm:ss");
                } else {
                    console.error(`Invalid date-time format for column ${column}:`, item[column]);
                }
            }
        });

        console.log("After Formatting:", JSON.stringify(item, null, 2)); // Debugging
        return item;
    });
};



// single image upload 
const uploadSingleImageToS3 = async (filedata, prefix) => {
    let filePath = "";
    let fileName = "";

    if (filedata) {
        const timestamp = Date.now();
        
        const ext = filedata.originalname.split('.').pop();
        fileName = `${randomImageName()}_care_${timestamp}.${ext}`.replace(/\s+/g, "-");
        filePath = prefix + fileName;
        const imageParams = {
            Bucket: bucketName,
            Key: filePath,
            Body: filedata.buffer,
            ContentType: filedata.mimetype,
        };

        try {
            const imageCommand = new PutObjectCommand(imageParams);
            await s3.send(imageCommand);
            filePath = bucketURL + filePath;
            console.log("Image successfully uploaded: ", filePath);
            return filePath;
        } catch (error) {
            console.error("Error uploading image to S3: ", error);
            throw new Error("Failed to upload image");
        }
    }
};


const deleteImageFromS3 = async (imageUrl, prefix) => {
    try {
        const imageName = imageUrl.split("/").pop(); 
        const imageParams = {
            Bucket: bucketName,
            Key: `${prefix}${imageName}`,
        };

        console.log("Deleting image from S3 bucket...", imageParams);

        const imageCommand = new DeleteObjectCommand(imageParams);
        const s3Response = await s3.send(imageCommand);

        if (!s3Response || s3Response.$metadata.httpStatusCode !== 204) {
            console.error("Failed to delete image from S3:", s3Response);
            return false;
        }

        return true; 
    } catch (error) {
        console.error("Error deleting image from S3:", error);
        return false;
    }
};


module.exports = { updateAndFind, formatDateAndTime, uploadSingleImageToS3, deleteImageFromS3 }