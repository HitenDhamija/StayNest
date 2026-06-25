const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// multer
const  upload = multer({ dest: '/tmp' });

router.get('/', (req, res) => {
  res.status(200).json({
    greeting: 'Hello from airbnb-clone api',
  });
});

// upload photo using image url
router.post('/upload-by-link', async (req, res) => {
  try {
    const { link } = req.body;
    const useCloudinary = process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_NAME !== "mock";

    if (useCloudinary) {
      let result = await cloudinary.uploader.upload(link, {
        folder: 'Airbnb/Places',
      });
      res.json(result.secure_url);
    } else {
      const download = require('image-downloader');
      const newFilename = 'link_' + Date.now() + '.jpg';
      const targetDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const destPath = path.join(targetDir, newFilename);
      
      await download.image({
        url: link,
        dest: destPath,
      });

      const host = req.get('host');
      const protocol = req.protocol;
      res.json(`${protocol}://${host}/uploads/${newFilename}`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// upload images from local device
router.post('/upload', upload.array('photos', 100), async (req, res) => {
  try {
    let imageArray = [];
    const useCloudinary = process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_NAME !== "mock";
    const targetDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    for (let index = 0; index < req.files.length; index++) {
      let { path: filePath, originalname } = req.files[index];
      
      if (useCloudinary) {
        let result = await cloudinary.uploader.upload(filePath, {
          folder: 'Airbnb/Places',
        });
        imageArray.push(result.secure_url);
      } else {
        const ext = path.extname(originalname) || '.jpg';
        const newFilename = 'photo_' + Date.now() + '_' + index + ext;
        const destPath = path.join(targetDir, newFilename);
        fs.renameSync(filePath, destPath);

        const host = req.get('host');
        const protocol = req.protocol;
        imageArray.push(`${protocol}://${host}/uploads/${newFilename}`);
      }
    }

    res.status(200).json(imageArray);
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({
      error,
      message: 'Internal server error',
    });
  }
});


router.use('/user', require('./user'));
router.use('/places', require('./place'));
router.use('/bookings', require('./booking'));
router.use('/payment', require('./payment'));
router.use('/wishlist', require('./wishlist'));

module.exports = router;
