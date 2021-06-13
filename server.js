require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');

const fileUpload = require('express-fileupload');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // filename: function (req, file, cb) {
  //   cb(null, Date.now() + path.extname(file.originalname)); //Appending .jpg
  // },
});

var upload = multer({ storage: storage });

const { uploadFile, uploadFileBuffer, getFileStream } = require('./s3');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/images/:key', async (req, res, next) => {
  try {
    const key = req.params.key;
    const readStream = await getFileStream(key).on('error', (err) => {
      next(err);
    });
    readStream.pipe(res);
  } catch (e) {
    console.log('caught the error', e);
    return res.json({ err: 'something went wrong' });
  }
});

app.post('/api/express', upload.single('avatar'), function (req, res, next) {
  console.log({ ...req.body }); // text can be accessed here
  return res.json({ mgs: 'hello' });
});

app.post('/api/s3', upload.single('avatar'), async function (req, res, next) {
  try {
    const result = await uploadFile(req.file);
    await fs.unlink(req.file.path);
    return res.send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.post('/api/s3DirectUpload', fileUpload(), async function (req, res, next) {
  try {
    // //with name extension
    // const fileName =
    //   req.files.avatar.name.split('.')[0] +
    //   Date.now() +
    //   path.extname(req.files.avatar.name);
    // without name extension
    const fileName = req.files.avatar.name.split('.')[0] + Date.now();
    const fileContent = Buffer.from(req.files.avatar.data, 'binary');
    const result = await uploadFileBuffer(fileContent, fileName);
    return res.send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.post(
  '/api/expressS3/multi',
  upload.array('avatars'),
  async function (req, res, next) {
    try {
      const result = await Promise.all(
        req.files.map((file) => uploadFile(file))
      );
      req.files.forEach(async (file) => {
        await fs.unlink(file.path);
      });
      return res.send(result);
    } catch (error) {
      next(error);
    }
  }
);

app.post('/api/s3/multi', fileUpload(), async function (req, res, next) {
  try {
    const result = await Promise.all(
      req.files.avatars.map((file) =>
        uploadFileBuffer(
          Buffer.from(file.data, 'binary'),
          file.name.split('.')[0] + Date.now()
        )
      )
    );
    return res.send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//catch errors
app.use((err, req, res, next) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      '<mark>$&</mark>'
    ),
  };
  res.status(err.status || 500).send(errorDetails);
});

//
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
