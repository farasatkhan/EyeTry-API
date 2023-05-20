var { randomImageName } = require('./hashing');

var multer = require('multer');
var path = require('path');

// Upload Profile Image to S3
var storageMem = multer.memoryStorage();

// Upload Profile Images to Server
var storageDisk = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads/profile_images/')
    },
    filename: function (req, file, callback) {
        callback(null, randomImageName() + path.extname(file.originalname))
    }
});

exports.uploadProfileImagesServer = multer({storage: storageDisk});

exports.uploadMemStorageS3 = multer({ storage: storageMem});