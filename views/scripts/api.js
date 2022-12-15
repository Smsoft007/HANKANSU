// const axios = require("axios");
const userBaseUrl = "/api/user";
const commonBaseUrl = "/api/common";
const listBaseUrl = "/api/list";
const ftpBaseUrl = "/api/ftp/upload";
const axiosInstance = axios.create({
  timeout: 1000 * 60 * 5,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = $("meta[name='_csrf']").attr("content");
    config.headers["Csrf-Token"] = token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (!error.response || error.response.status === 502) {
      sessionStorage.removeItem("auth-token");
      location.reload();
    } else if (error.response.status === 401) {
      alert(`세션이 만료되어 로그인페이지로 이동합니다.`);
      sessionStorage.removeItem("auth-token");
      location.reload();
    }
    return Promise.reject(error);
  }
);

function hideLoadingBar() {
  $(".loding-bg").remove();
  $(".loding-box").remove();
}

function showLoadingBar() {
  let loadingBgDivHtml = '<div class="loding-bg"></div>';
  let loadingBoxHtml = '<div class="loding-box">';
  loadingBoxHtml += '	<div class="loding-img-box">';
  loadingBoxHtml += '		<div class="sk-circle">';
  loadingBoxHtml += '			<div class="sk-circle1 sk-child"></div>';
  loadingBoxHtml += '			<div class="sk-circle2 sk-child"></div>';
  loadingBoxHtml += '			<div class="sk-circle3 sk-child"></div>';
  loadingBoxHtml += '			<div class="sk-circle4 sk-child"></div>';
  loadingBoxHtml += '			<div class="sk-circle5 sk-child"></div>';
  loadingBoxHtml += '			<div class="sk-circle6 sk-child"></div>';
  loadingBoxHtml += '			<div class="sk-circle7 sk-child"></div>';
  loadingBoxHtml += '			<div class="sk-circle8 sk-child"></div>';
  loadingBoxHtml += '			<div class="sk-circle9 sk-child"></div>';
  loadingBoxHtml += '			<div class="sk-circle10 sk-child"></div>';
  loadingBoxHtml += '			<div class="sk-circle11 sk-child"></div>';
  loadingBoxHtml += '			<div class="sk-circle12 sk-child"></div>';
  loadingBoxHtml += "		</div>";
  loadingBoxHtml +=
    "		<h2>Data is being processed It will take 5-10 seconds.</h2>";
  loadingBoxHtml += "	</div>";
  loadingBoxHtml += "</div>";
  $("body").append($(loadingBgDivHtml));
  $("body").append($(loadingBoxHtml));
}
const api = {
  langChange(num) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post("/lang?num=" + num)
        .then(({ data }) => {
          resolve(data);
          location.reload();
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },
  userApi(url, param) {
    return new Promise((resolve, reject) => {
      showLoadingBar();
      axiosInstance
        .post(userBaseUrl + url, param)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err.response);
        })
        .finally(() => {
          hideLoadingBar();
        });
    });
  },
  commonApi(url, param, hideLoading) {
    return new Promise((resolve, reject) => {
      // if (loading) showLoadingBar();
      if (!hideLoading) showLoadingBar();
      axiosInstance
        .post(commonBaseUrl + url, param)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err.response);
        })
        .finally(() => {
          if (!hideLoading) hideLoadingBar();
        });
    });
  },
  listApi(url, param) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(listBaseUrl + url, param)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },
  ftpApi(fileInput) {
    const form = new FormData();
    const myFile = $(fileInput).prop("files");
    if (!myFile[0]) {
      alert("파일을 선택해 주세요");
      return null;
    }
    form.append("upload", myFile[0]);

    return new Promise((resolve, reject) => {
      axiosInstance
        .post(ftpBaseUrl, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          maxContentLength: 1000000000,
          maxBodyLength: 1000000000,
        })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },
};
