const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: './uploads/kyc/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
module.exports = upload;