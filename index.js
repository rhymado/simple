const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

app.listen(8080, () => {
  console.log("Server Running at 8080");
});

const createStorage = (type) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/".concat(type));
    },
    filename: (req, file, cb) => {
      const format = `${file.fieldname}-${Date.now()}${path.extname(
        file.originalname
      )}`;
      cb(null, format);
    },
  });

const upload = (type) => multer({ storage: createStorage(type) });

app.use(express.static("public"));

app.get("/ping", (_, res) => {
  res.json({
    msg: "pong",
  });
});

app.post(
  "/upload",
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  function (req, res, next) {
    upload("images").single("images")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
      } else if (err) {
        console.log("not multer", err);
      }
      console.log("multer body", req.body);
      console.log("multer header", req.headers);
      next();
    });
  },
  (req, res) => {
    console.log("file", req.file);
    res.json({
      msg: req.file ? "berhasil" : "gagal",
      file: req.file ? req.file : null,
    });
  }
);
