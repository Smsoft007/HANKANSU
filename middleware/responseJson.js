module.exports = (req, res, next) => {
  const originJson = res.json;
  res.responseJson = (jsonData) => {
    originJson.call(res, jsonData.toJson());
  };
  next();
};
