var AWS = require('aws-sdk');
// Require multer for image uploading and multers3 to upload directly to s3
var multer = require('multer');
var multerS3 = require('multer-s3');

// Configure aws s3 SDK (update authentication)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var s3 = new AWS.S3();
const myBucket = process.env.BUCKET;

// Multer upload (Use multer-s3 to save directly to AWS instead of locally)
var multer = multer({
  storage: multerS3({
    s3: s3,
    bucket: myBucket,
    // Set public read permissions
    acl: 'public-read',
    // Auto detect contet type
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    // Set key/ filename as original uploaded name
    key: function (req, file, cb) {
      cb(null, 'img/'+new Date() + '-'+file.originalname)
    }
  }), 
  limits: {
    fileSize: 1000 * 1000 * 2
  }
})

module.exports = multer