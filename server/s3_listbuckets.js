// Load the AWS SDK for node.js
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

// Create an S3 service object

function listBuckets() {
    s3 = new AWS.S3({apiVersion: '2006-03-1'});

    // Call S3 to list the buckets
    s3.listBuckets(function(err, data) {
    if (err) {
        console.log("Error:", err);
    } else {
        console.log("Success:", JSON.stringify(data.Buckets)); 
        /*  JSON.stringify is only being used to force the data into an immediately readable format.
            The data would still be correctly retrieved without it, but the debugger wouldn't be able to 
            display it before execution finishes.
        */
    }
    });
}

listBuckets();


