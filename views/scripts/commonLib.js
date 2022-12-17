const commonLib = {
  nullCheck() {
    var keys = Object.keys(arguments[0]);
    for (var key in keys) {
      if (arguments[0][keys[key]] === 0) {
        arguments[0][keys[key]] = '0';
      }
      if (
        arguments[0][keys[key]] === null ||
        arguments[0][keys[key]] === '' ||
        arguments[0][keys[key]] === undefined
      ) {
        console.log(keys[key] + ' is null');
        return true;
      }
    }
    return false;
  },
  bindValue: (obj) => {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      try {
        if ($('#' + keys[i])[0] != undefined) {
          var tagName = $('#' + keys[i]).prop('tagName');
          if (tagName == 'SPAN') {
            $('#' + keys[i]).html(obj[keys[i]]);
          } else if (tagName == 'INPUT') {
            $('#' + keys[i]).val(obj[keys[i]]);
          } else {
            $('#' + keys[i]).text(obj[keys[i]]);
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
        if ($(Name + '[name=' + keys[i] + ']') != undefined) {
          $(Name + '[name=' + keys[i] + ']').html(obj[keys[i]]);
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  comma: (x) => {
    if (!commonLib.nullCheck(x)) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return 0;
    }
  },
  copyText(val) {
    var tempElem = document.createElement('textarea');
    tempElem.value = val;
    document.body.appendChild(tempElem);
    tempElem.select();
    document.execCommand('copy');
    document.body.removeChild(tempElem);
    alert('복사되었습니다');
  },

  getBrowserInfo: function () {
    var ua = navigator.userAgent;
    var browerName = '';
    if (ua.indexOf('MSIE') > 0 || ua.indexOf('Trident') > 0)
      browerName = 'Internet Explorer';
    else if (ua.indexOf('Opera') > 0 || ua.indexOf('OPR') > 0)
      browerName = 'Opera';
    else if (ua.indexOf('Firefox') > 0) browerName = 'Firefox';
    else if (ua.indexOf('Safari') > 0) {
      if (ua.indexOf('Chrome') > 0) browerName = 'Chrome';
      else browerName = 'Safari';
    }
    return browerName;
  },
  getOSInfo: function () {
    var ua = navigator.userAgent;
    var strOs = '';
    if (ua.indexOf('NT 6.0') != -1) strOs = 'Windows Vista/Server 2008';
    else if (ua.indexOf('NT 6.1') != -1) strOs = 'Windows 7';
    else if (ua.indexOf('NT 5.2') != -1) strOs = 'Windows Server 2003';
    else if (ua.indexOf('NT 5.1') != -1) strOs = 'Windows XP';
    else if (ua.indexOf('NT 5.0') != -1) strOs = 'Windows 2000';
    else if (ua.indexOf('NT') != -1) strOs = 'Windows NT';
    else if (ua.indexOf('9x 4.90') != -1) strOs = 'Windows Me';
    else if (ua.indexOf('98') != -1) strOs = 'Windows 98';
    else if (ua.indexOf('95') != -1) strOs = 'Windows 95';
    else if (ua.indexOf('Win16') != -1) strOs = 'Windows 3.x';
    else if (ua.indexOf('Windows') != -1) strOs = 'Windows';
    else if (ua.indexOf('Linux') != -1) strOs = 'Linux';
    else if (ua.indexOf('Mac') != -1) strOs = 'Mac OS';
    else if (ua.indexOf('Macintosh') != -1) strOs = 'Macintosh';
    else if (ua.indexOf('iOS') != -1) strOs = 'iphone Os';
    else if (ua.indexOf('iPhone') != -1) strOs = 'iPhone';
    else if (ua.indexOf('iPad') != -1) strOs = 'iPad';
    else strOs = 'not defined';
    return strOs;
  },
  isApp: function () {
    var ua = navigator.userAgent;
    var strOs = '';
    if (ua.indexOf('iPhone') != -1) strOs = 'iPhone';
    else if (ua.indexOf('Android') != -1) strOs = 'Android';
    else if (ua.indexOf('Mac') != -1) strOs = 'Mac';
    else if (ua.indexOf('Version') != -1) strOs = 'NativApp';
    else if (ua.indexOf('Chrome') != -1) strOs = 'Chrome';
    else strOs = 'not defined';
    return strOs;
  },
  getCountry: function () {
    var country = navigator.language || navigator.browserLanguage;
    return country;
  },
};
