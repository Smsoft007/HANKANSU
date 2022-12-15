require("../env");
const env = process.env;
const FTP = require("ftp");
const option = {
  host: env.FTP_HOST,
  port: 21,
  user: env.FTP_USER,
  password: env.FTP_PASSWORD,
};
exports.upload = (filePath, dest, callback) => {
  const client = new FTP();
  client.connect(option);
  client.on("ready", function () {
    client.put(filePath, dest, async function (err) {
      if (err) console.log("upload error id : ", err);
      client.end();
      callback(err);
    });
  });
};
