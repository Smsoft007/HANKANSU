const commonLib = {
  nullCheck() {
    var keys = Object.keys(arguments[0]);
    for (var key in keys) {
      if (arguments[0][keys[key]] === 0) {
        arguments[0][keys[key]] = "0";
      }
      if (
        arguments[0][keys[key]] === null ||
        arguments[0][keys[key]] === "" ||
        arguments[0][keys[key]] === undefined
      ) {
        console.log(keys[key] + " is null");
        return true;
      }
    }
    return false;
  },
  bindValue: (obj) => {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      try {
        if ($("#" + keys[i])[0] != undefined) {
          var tagName = $("#" + keys[i]).prop("tagName");
          if (tagName == "SPAN") {
            $("#" + keys[i]).html(obj[keys[i]]);
          } else if (tagName == "INPUT") {
            $("#" + keys[i]).val(obj[keys[i]]);
          } else {
            $("#" + keys[i]).text(obj[keys[i]]);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  bindValueByName: (Name, obj) => {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      try {
        if ($(Name + "[name=" + keys[i] + "]") != undefined) {
          $(Name + "[name=" + keys[i] + "]").html(obj[keys[i]]);
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  comma: (x) => {
    if (!commonLib.nullCheck(x)) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return 0;
    }
  },
  copyText(val) {
    var tempElem = document.createElement("textarea");
    tempElem.value = val;
    document.body.appendChild(tempElem);
    tempElem.select();
    document.execCommand("copy");
    document.body.removeChild(tempElem);
    alert("복사되었습니다");
  },
};
