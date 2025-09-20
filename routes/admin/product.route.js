const express = require("express");
const multer = require("multer"); // muter upload image
//error
const cloudinary = require("cloudinary").v2; // Khởi tạo upload image cloud
const streamifier = require("streamifier");

const router = express.Router();

// cloud dinary connect
cloudinary.config({
  cloud_name: "dvj0rkca1",
  api_key: "616945896141741",
  api_secret: "NP-oZXsiA6XM1HVksn9JkOM5oXM", // Click 'View API Keys' above to copy your API secret
});

// const multilStorage = require("../../helpers/multer.helper");

const upload = multer({
  // multer image
  // dest: "./public/uploads/" /* storage: multilStorage() */,
  storage: multer.memoryStorage(),
});

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"), // multer upload image
  // --------------------------- up image cloundinary ---------------------------
  function (req, res, next) {
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      async function upload(req) {
        let result = await streamUpload(req);
        req.body[req.file.fieldname] = result.secure_url; //req.body có thằng fieldname và gán lại cho thằng result có key secure_url
        next();
      }
      upload(req);
    } else {
      next();
    }
  },

  validate.creatPosst, // mục đích là khi người dùng truy cập vào /create thì phải đi qua th validate (middleWare) trước để kiểm tra điều kiện, rồi mới đền thằng controller
  controller.createPost
);

router.get("/edit/:id", controller.edit); // mothod get chỉ để lấy ra giao diện

router.patch(
  "/edit/:id",
  upload.single("thumbnail"), // multer upload image
  validate.creatPosst, // mục đích là khi người dùng truy cập vào /create thì phải đi qua th validate (middleWare) trước để kiểm tra điều kiện, rồi mới đền thằng controller
  controller.editPatch
);

router.get("/detail/:id", controller.detail); // mothod get chỉ để lấy ra giao diện

module.exports = router;
