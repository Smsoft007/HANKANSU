let lsConfirm = false;
window.onload = function () {
  const firebaseConfig = {
    apiKey: "AIzaSyA1wEusnIL6kDovXLw5TNjIz_IhPkpXuHI",
    authDomain: "exchange-1ccd4.firebaseapp.com",
    projectId: "exchange-1ccd4",
    storageBucket: "exchange-1ccd4.appspot.com",
    messagingSenderId: "177441496668",
    appId: "1:177441496668:web:baad659d54596b5f5d5099",
    measurementId: "G-CL942NE9RT"
  };

  firebase.initializeApp(firebaseConfig);
  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var uid = user.uid;
      var email = user.email;
      var photoURL = user.photoURL;
      var phoneNumber = user.phoneNumber;
      var isAnonymous = user.isAnonymous;
      var displayName = user.displayName;
      var providerData = user.providerData;
      var emailVerified = user.emailVerified;
    }
  });

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "normal",
      callback: function (response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
      "expired-callback": function () {
        // Response expired. Ask user to solve reCAPTCHA again.
      },
    }
  );

  recaptchaVerifier.render().then(function (widgetId) {
    window.recaptchaWidgetId = widgetId;
  });
};
function firbaseAuthPhone(phoneNumber) {
  var appVerifier = window.recaptchaVerifier;
  firebase
    .auth()
    .signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(function (confirmationResult) {
      alert("전송 완료");
      window.confirmationResult = confirmationResult;
    })
    .catch(function (error) {
      alert("전송에 실패하였습니다")
    });
}
function firbaseNumberConfirm(number) {
  confirmationResult
    .confirm(number)
    .then(function (result) {
      lsConfirm = true
      alert("성공")
    })
    .catch(function (error) {
      alert("실패")
      lsConfirm = false
    });
}
