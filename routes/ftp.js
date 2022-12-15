const express = require("express");
const router = express.Router();
const Response = require("../model/response");
const ftpHelper = require("../lib/ftp-helper");
const appRoot = require("app-root-path");

router.post("/upload", async (req, res, next) => {
  const now = new Date();
  console.log("startUpload!!");
  const uploadFile = req.files.upload;
  const filePath = `${appRoot}/temp/${uploadFile.name}`;
  const destPath = `images/${now.getTime()}_${uploadFile.name}`;
  console.log(filePath);
  console.log(destPath);
  uploadFile.mv(filePath, () => {
    ftpHelper.upload(filePath, destPath, (err) => {
      const respose = new Response();
      if (err) respose.setReturnCode(1);
        
      else respose.setReturnCode(0);
      respose.setData({ fileName: destPath, filePath: destPath });

      res.responseJson(respose);
    });
  });
});

module.exports = router;
