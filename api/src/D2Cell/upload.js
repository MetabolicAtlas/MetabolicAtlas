const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// 设置 multer 存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // 上传文件保存的目录
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // 自定义文件名
  }
});

const upload = multer({ storage: storage });

// 文件上传接口
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  res.json({ message: 'File uploaded successfully!', file: req.file });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
