require("../env");
const env = process.env;
const https = require("follow-redirects").https;

exports.sendSms = (msg, phone) => {
  console.log(`Infobip msg : ${msg}`);
  console.log(`Infobip phnum : ${phone}`);
  const options = {
    method: "POST",
    hostname: env.INFOBIP_BASURL,
    path: "/sms/2/text/advanced",
    headers: {
      Authorization: `App ${env.INFOBIP_PRV}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    maxRedirects: 20,
  };

  const req = https.request(options, function (res) {
    const chunks = [];
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
    res.on("end", function (chunk) {
      const body = Buffer.concat(chunks);
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  const postData = JSON.stringify({
    messages: [
      {
        from: "Global Bit Block",
        destinations: [{ to: phone }],
        text: msg,
      },
    ],
  });

  req.write(postData);
  req.end();
};
