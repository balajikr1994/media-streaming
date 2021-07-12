const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

app.get('/s3-video', (req, res) => {
  var params = {
    Bucket: process.env.BUCKET,
    Key: 'gudsho_video_samples/05-06-2021/1622879376109-PapasaPromoamp4.mp4',
  };
  s3.getObject(params)
    .on('httpHeaders', function (statusCode, headers) {
      res.set('Content-Length', headers['content-length']);
      res.set('Content-Type', headers['content-type']);
      this.response.httpResponse.createUnbufferedStream().pipe(res);
    })
    .send();
});

app.get('/get-signed-url', (req, res) => {
  const fileurls = [];
  const params = {
    Bucket: process.env.BUCKET,
    Key: 'check-images/',
    Expires: 60 * 60,
    ContentType: 'image/jpeg',
  };
  s3.getSignedUrl('putObject', params, function (err, url) {
    if (err) {
      console.log('Error getting presigned url from AWS S3');
      res.json({
        success: false,
        message: 'Pre-Signed URL error',
        urls: fileurls,
      });
    } else {
      fileurls[0] = url;
      console.log('Presigned URL: ', fileurls[0]);
      res.json({
        success: true,
        message: 'AWS SDK S3 Pre-signed urls generated successfully.',
        urls: fileurls,
      });
    }
  });
});

app.get('/', function (req, res) {
  console.log(path.join(__dirname + '../client' + '/index.html'));
  res.sendFile('index.html', {
    root: path.join(__dirname, '../client'),
  });
});

app.listen(process.env.PORT, function () {
  console.log(`Listening on port${process.env.PORT}!`);
});
