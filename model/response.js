function Response(name, data, returnCode, cnt) {
  this.name = name || null;
  this.data = data || null;
  this.cnt = cnt || null;
  this.returnCode = returnCode || null;
  this.setData = function (data) {
    this.data = data;
  };
  this.setCnt = function (cnt) {
    this.cnt = cnt;
  };
  this.setReturnCode = function (returnCode) {
    this.returnCode = returnCode;
  };
  this.setName = function (name) {
    this.name = name;
  };
  this.toJson = function () {
    let returnJson = {
      returnCode: this.returnCode,
      name: this.name,
      data: this.data,
      cnt: this.cnt,
    };
    Object.keys(returnJson).forEach(key=>{
      const value = returnJson[key]
      if (value === "" || value === null) {
        delete returnJson[key];
      }
    })
    return returnJson
  };
}
module.exports = Response;
