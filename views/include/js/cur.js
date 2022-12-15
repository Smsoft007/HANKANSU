$(document).ready(function () {

  //언어 박스 스크립트
  langCount = 0;
  $(".lang > a").click(function () {
    if (langCount == 0) {
      $(".langbox").slideDown(function () {
        langCount = 1;
      });
    } else if (langCount == 1) {
      $(".langbox").slideUp(function () {
        langCount = 0;
      });
    }
  })
  //다른곳 누를시 언어박스 닫기.
  $(document).click(function () {
    if (langCount == 1) {
      $(".langbox").slideUp(function () {
        langCount = 0;
      });
    }
  });

  $(".mainmenu > li").hover(function () {
    $(this).find(".dropmenu").css("display", "block");
  }, function () {
    $(this).find(".dropmenu").css("display", "none");
  })



  // $(".over-black").css("position", "relative").css("overflow", "hidden");
  // $(".over-black").prepend("<div style='width:100%; height: 100vh; overflow:none; background: rgba(0,0,0,0.3); position: absolute; top:0; z-index:0'></div>");

  //헤더 웹&앱
  winWidth = $(window).width();

  if (winWidth > 601) {
    $(".webhead").removeClass("d-none");
    $(".webhead").addClass("d-block");
    $(".apphead").removeClass("d-block");
    $(".apphead").addClass("d-none");
  } else if (winWidth < 600) {
    $(".webhead").removeClass("d-block");
    $(".webhead").addClass("d-none");
    $(".apphead").removeClass("d-none");
    $(".apphead").addClass("d-block");
  }

  $(window).resize(function () {
    winWidth = $(window).width();

    if (winWidth > 601) {
      $(".webhead").removeClass("d-none");
      $(".webhead").addClass("d-block");
      $(".apphead").removeClass("d-block");
      $(".apphead").addClass("d-none");
    } else if (winWidth < 600) {
      $(".webhead").removeClass("d-block");
      $(".webhead").addClass("d-none");
      $(".apphead").removeClass("d-none");
      $(".apphead").addClass("d-block");
    }
  });

  //앱 메뉴박스
  $(".btn-appmenu").click(function () {
    $("#menu").before("<div class='overlayblack' style='width:100%; height: 100vh; overflow:none; background: rgba(0,0,0,0.3); position: fixed; top:0; z-index:0;'></div>");
    $("body").css("overflow", "hidden");
    $("#menu").animate({
      left: "0"
    }, 500);
  });
  $("#menu .close").click(function () {
    $(".overlayblack").remove();
    $("body").css("overflow", "auto");
    $("#menu").animate({
      left: "-90%"
    }, 500);
  });

  //입금증 박스
  $(".btn-deposit").click(function () {
    $("#deposit").before("<div class='overlayblack2' style='width:100%; height: 100vh; overflow:none; background: rgba(0,0,0,0.3); position: fixed; top:0; z-index:0;'></div>");
    $("body").css("overflow", "hidden");
    $("#deposit").fadeIn(500);
  });
  $("#deposit .close").click(function () {
    $(".overlayblack2").remove();
    $("body").css("overflow", "auto");
    $("#deposit").fadeOut(500);
  });

  //마이페이지 큐알 박스
  $(".btn-payqr").click(function () {
    $("#payqr").before("<div class='overlayblack3' style='width:100%; height: 100vh; overflow:none; background: rgba(0,0,0,0.3); position: fixed; top:0; z-index:0;'></div>");
    $("body").css("overflow", "hidden");
    $("#payqr").fadeIn(500);
  });
  $("#payqr .close").click(function () {
    $(".overlayblack3").remove();
    $("body").css("overflow", "auto");
    $("#payqr").fadeOut(500);
  });

  //slide index.ejs 로 이동
  // $('.slidebox').slick({
  //   dots: false,
  //   infinite: true,
  //   speed: 500,
  //   fade: true,
  //   autoplay: true,
  //   autoplaySpeed: 3000,
  //   cssEase: 'linear',
  //   pauseOnHover:false
  // });

  /********************* faq *****************************/

  $(".question").click(function () {
    faqOpenCheck = $(this).parent("li").hasClass("open");
    if (faqOpenCheck == false) {
      $(".question").parent("li").removeClass("open");
      $(".question").parent("li").find(".answer").slideUp(300);
      $(this).parent("li").addClass("open");
      $(this).parent("li").find(".answer").slideDown(300);
    } else if (faqOpenCheck == true) {
      $(this).parent("li").removeClass("open");
      $(this).parent("li").find(".answer").slideUp(300);
    }

  });

  $(".faqmenu1").click(function () {
    faqmenucheck = $(this).hasClass("active");
    if (faqmenucheck == true) {
      return;
    } else if (faqmenucheck == false) {
      $(".faqmenubox li a").removeClass("active");
      $(this).addClass("active");
      $(".faqbox").css("display", "none");
      $(".faqbox1").fadeIn(300);
    }
  });
  $(".faqmenu2").click(function () {
    faqmenucheck = $(this).hasClass("active");
    if (faqmenucheck == true) {
      return;
    } else if (faqmenucheck == false) {
      $(".faqmenubox li a").removeClass("active");
      $(this).addClass("active");
      $(".faqbox").css("display", "none");
      $(".faqbox2").fadeIn(300);
    }
  });
  $(".faqmenu3").click(function () {
    faqmenucheck = $(this).hasClass("active");
    if (faqmenucheck == true) {
      return;
    } else if (faqmenucheck == false) {
      $(".faqmenubox li a").removeClass("active");
      $(this).addClass("active");
      $(".faqbox").css("display", "none");
      $(".faqbox3").fadeIn(300);
    }
  });
  $(".faqmenu4").click(function () {
    faqmenucheck = $(this).hasClass("active");
    if (faqmenucheck == true) {
      return;
    } else if (faqmenucheck == false) {
      $(".faqmenubox li a").removeClass("active");
      $(this).addClass("active");
      $(".faqbox").css("display", "none");
      $(".faqbox4").fadeIn(300);
    }
  });
  $(".faqmenu5").click(function () {
    faqmenucheck = $(this).hasClass("active");
    if (faqmenucheck == true) {
      return;
    } else if (faqmenucheck == false) {
      $(".faqmenubox li a").removeClass("active");
      $(this).addClass("active");
      $(".faqbox").css("display", "none");
      $(".faqbox5").fadeIn(300);
    }
  });


  /********************* faq end *************************/






});