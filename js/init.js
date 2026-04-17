/*
 * Copyright (c) 2022 Marketify
 * Author: Marketify
 * This file is made for CURRENT TEMPLATE
 */

jQuery(document).ready(function () {
  "use strict";

  // here all ready functions

  edrea_tm_picker();
  edrea_tm_modalbox();
  edrea_tm_page_transition();
  edrea_tm_trigger_menu();
  edrea_tm_about_popup();
  edrea_tm_portfolio_popup();
  edrea_tm_news_popup();
  edrea_tm_cursor();
  edrea_tm_imgtosvg();
  edrea_tm_popup();
  edrea_tm_data_images();
  edrea_tm_contact_form();
  hashtag();
  edrea_tm_swiper();
  edrea_tm_headline();
  edrea_tm_location();
  edrea_tm_color_switcher();
  edrea_tm_cursor_switcher();
  edrea_tm_switcher_opener();
  fimarx_social_graph();

  if (document.readyState === "complete") {
    edrea_tm_my_load();
  } else {
    jQuery(window).on("load", function () {
      edrea_tm_my_load();
    });
  }

  jQuery(window).on("resize", function () {
    edrea_tm_smart_menu_reset();
  });
});

// -----------------------------------------------------
// ---------------   FUNCTIONS    ----------------------
// -----------------------------------------------------

// -----------------------------------------------------
// ---------------   COLOR PICKER    -------------------
// -----------------------------------------------------

function edrea_tm_picker() {
  "use strict";

  if (jQuery(".edrea_tm_settings").length) {
    // attach background for all colors
    var list = jQuery(".edrea_tm_settings .colors li a");
    list.each(function () {
      jQuery(this).css({ backgroundColor: jQuery(this).data("color") });
    });

    // change root color
    list.on("click", function () {
      var element = jQuery(this);
      var color = element.data("color");
      jQuery(":root").css("--main-color", color);
      return false;
    });
  }
}

// -------------------------------------------------
// -------------  PROGRESS BAR  --------------------
// -------------------------------------------------

function edrea_tm_my_progress() {
  "use strict";

  jQuery(".progress_inner").each(function () {
    var progress = jQuery(this);
    var pValue = parseInt(progress.data("value"), 10);
    var pColor = progress.data("color");
    var pBarWrap = progress.find(".bar");
    var pBar = progress.find(".bar_in");
    pBar.css({
      width: pValue + "%",
      backgroundColor: pColor,
    });
    setTimeout(function () {
      pBarWrap.addClass("open");
    });
  });
}

// -----------------------------------------------------
// ---------------   CIRCULAR PROGRESS   ---------------
// -----------------------------------------------------

function edrea_tm_circular_progress() {
  "use strict";

  // CSS conic-gradient circular progress (no SVG — avoids innerHTML namespace issues)
  jQuery(".circular_progress_bar .myCircle").each(function () {
    var el = this;
    var $el = jQuery(el);
    var targetValue = parseFloat($el.data("value")); // 0.0 – 1.0
    var pct = Math.round(targetValue * 100);

    $el.html('<span class="number">' + pct + "%</span>");
    el.style.background =
      "conic-gradient(#fa5b0f 0%, rgba(255,255,255,0.08) 0%)";

    var startTime = null;
    var duration = 1400;

    function animate(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      // Ease-out cubic
      var eased = 1 - Math.pow(1 - p, 3);
      var cur = eased * targetValue * 100;
      el.style.background =
        "conic-gradient(#fa5b0f " +
        cur.toFixed(2) +
        "%, rgba(255,255,255,0.08) " +
        cur.toFixed(2) +
        "%)";
      if (p < 1) requestAnimationFrame(animate);
    }

    setTimeout(function () {
      requestAnimationFrame(animate);
    }, 150);
  });
}

// -----------------------------------------------------
// --------------------   MODALBOX    ------------------
// -----------------------------------------------------

function edrea_tm_modalbox() {
  "use strict";

  jQuery(".edrea_tm_all_wrap").prepend(
    '<div class="edrea_tm_modalbox"><div class="box_inner"><div class="close"><a hr' +
      'ef="#"><i class="fa-solid fa-xmark"></i></a></div><div class="description_wrap"></di' +
      "v></div></div>",
  );
}

// -----------------------------------------------------
// -------------   PAGE TRANSITION    ------------------
// -----------------------------------------------------

function edrea_tm_page_transition() {
  "use strict";

  var section = jQuery(".edrea_tm_section");
  var allLi = jQuery(".transition_link li");
  var button = jQuery(".transition_link a");
  var wrapper = jQuery(".edrea_tm_all_wrap");
  var enter = wrapper.data("enter");
  var exit = wrapper.data("exit");

  button.on("click", function () {
    var element = jQuery(this);
    var href = element.attr("href");
    if (element.parent().hasClass("edrea_tm_button")) {
      jQuery('.menu .transition_link a[href="' + href + '"]').trigger("click");
      hashtag();
      return false;
    }
    var sectionID = jQuery(href);
    var parent = element.closest("li");
    if (!parent.hasClass("active")) {
      allLi.removeClass("active");
      wrapper.find(section).removeClass("animated " + enter);
      if (wrapper.hasClass("opened")) {
        wrapper.find(section).addClass("animated " + exit);
      }
      jQuery('.transition_link a[href="' + href + '"]')
        .parent()
        .addClass("active");
      wrapper.addClass("opened");
      wrapper
        .find(sectionID)
        .removeClass("animated " + exit)
        .addClass("animated " + enter);
      jQuery(section).addClass("hidden");
      jQuery(sectionID).removeClass("hidden").addClass("active");
    }
    return false;
  });
}

// -----------------------------------------------------
// ---------------   TRIGGER MENU    -------------------
// -----------------------------------------------------

function edrea_tm_trigger_menu() {
  "use strict";

  var hamburger = jQuery(".edrea_tm_topbar .trigger .hamburger");
  var mobileMenu = jQuery(".edrea_tm_mobile_menu");
  var mobileMenuList = jQuery(".edrea_tm_mobile_menu ul li a");

  hamburger.on("click", function () {
    var element = jQuery(this);

    if (element.hasClass("is-active")) {
      element.removeClass("is-active");
      mobileMenu.removeClass("opened");
    } else {
      element.addClass("is-active");
      mobileMenu.addClass("opened");
    }
    return false;
  });

  mobileMenuList.on("click", function () {
    jQuery(".edrea_tm_topbar .trigger .hamburger").removeClass("is-active");
    mobileMenu.removeClass("opened");
    return false;
  });
}

function edrea_tm_smart_menu_reset() {
  "use strict";

  var hamburger = jQuery(".edrea_tm_topbar .trigger .hamburger");
  var mobileMenu = jQuery(".edrea_tm_mobile_menu");

  if (jQuery(window).width() > 1040) {
    if (hamburger.hasClass("is-active")) {
      hamburger.removeClass("is-active");
      mobileMenu.removeClass("opened");
    }
  }
}

// -------------------------------------------------
// ---------------  ABOUT POPUP  -------------------
// -------------------------------------------------

function edrea_tm_about_popup() {
  "use strict";

  var button = jQuery(".edrea_tm_about .edrea_tm_button a");
  var close = jQuery(".edrea_tm_modalbox .close");
  var modalBox = jQuery(".edrea_tm_modalbox");
  var hiddenContent = jQuery(".edrea_tm_hidden_content").html();

  button.on("click", function () {
    modalBox.addClass("opened");
    modalBox.find(".description_wrap").html(hiddenContent);
    edrea_tm_data_images();
    edrea_tm_my_progress();
    edrea_tm_circular_progress();
    edrea_tm_mycarousel();
    edrea_tm_location();
    edrea_tm_headline();
  });
  close.on("click", function () {
    modalBox.removeClass("opened");
    modalBox.find(".description_wrap").html("");
  });
}

// -------------------------------------------------
// -----------  PORTFOLIO POPUP  -------------------
// -------------------------------------------------

function edrea_tm_portfolio_popup() {
  "use strict";

  var modalBox = jQuery(".edrea_tm_modalbox");
  var button = jQuery(".edrea_tm_portfolio .portfolio_popup");
  var closePopup = modalBox.find(".close");

  button.off().on("click", function () {
    var element = jQuery(this);
    var parent = element.closest(".list_inner");
    var content = parent.find(".edrea_tm_hidden_content").html();
    var image = parent.find(".image .main").data("img-url");
    var title = parent.find(".details h3").text();
    var category = parent.find(".details span").text();
    modalBox.addClass("opened");
    modalBox.find(".description_wrap").html(content);
    modalBox
      .find(".portfolio_popup_details")
      .prepend(
        '<div class="top_image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main' +
          '" data-img-url="' +
          image +
          '"></div></div>',
      );
    modalBox
      .find(".portfolio_popup_details .top_image")
      .after('<div class="portfolio_main_title"><h3>' + title + "</h3></div>");
    edrea_tm_data_images();
    edrea_tm_popup();
    return false;
  });
  closePopup.on("click", function () {
    modalBox.removeClass("opened");
    modalBox.find(".description_wrap").html("");
    return false;
  });
}

// -------------------------------------------------
// ----------------  NEWS POPUP  -------------------
// -------------------------------------------------

function edrea_tm_news_popup() {
  "use strict";

  var modalBox = jQuery(".edrea_tm_modalbox");
  var button = jQuery(
    ".edrea_tm_news .news_popup,.edrea_tm_news .news_list h3 a",
  );
  var closePopup = modalBox.find(".close");

  button.off().on("click", function () {
    var element = jQuery(this);
    var parent = element.closest(".list_inner");
    var content = parent.find(".edrea_tm_hidden_content").html();
    var image = parent.find(".image .main").data("img-url");
    var title = parent.find(".details h3 a").text();
    var category = parent.find(".details span").html();
    modalBox.addClass("opened");
    modalBox.find(".description_wrap").html(content);
    modalBox
      .find(".news_popup_details")
      .prepend(
        '<div class="top_image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main' +
          '" data-img-url="' +
          image +
          '"></div></div>',
      );
    modalBox
      .find(".news_popup_details .top_image")
      .after(
        '<div class="news_main_title"><h3>' +
          title +
          "</h3><span>" +
          category +
          "</spa" +
          "n><div>",
      );
    edrea_tm_data_images();
    return false;
  });
  closePopup.on("click", function () {
    modalBox.removeClass("opened");
    modalBox.find(".description_wrap").html("");
    return false;
  });
}

// -----------------------------------------------------
// ---------------   PRELOADER   -----------------------
// -----------------------------------------------------

function edrea_tm_preloader() {
  "use strict";

  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
    navigator.userAgent,
  )
    ? true
    : false;
  var preloader = jQuery("#preloader");

  if (!isMobile) {
    setTimeout(function () {
      preloader.addClass("preloaded");
    }, 800);
    setTimeout(function () {
      preloader.remove();
    }, 2000);
  } else {
    preloader.remove();
  }
}

// -----------------------------------------------------
// -----------------   MY LOAD    ----------------------
// -----------------------------------------------------

function edrea_tm_my_load() {
  "use strict";

  var speed = 500;
  setTimeout(function () {
    edrea_tm_preloader();
  }, speed);
}

// -----------------------------------------------------
// ------------------   CURSOR    ----------------------
// -----------------------------------------------------

function edrea_tm_cursor() {
  "use strict";

  var myCursor = jQuery(".mouse-cursor");

  if (myCursor.length) {
    if (jQuery("body")) {
      const e = document.querySelector(".cursor-inner"),
        t = document.querySelector(".cursor-outer");
      let n,
        i = 0,
        o = !1;
      ((window.onmousemove = function (s) {
        (o ||
          (t.style.transform =
            "translate(" + s.clientX + "px, " + s.clientY + "px)"),
          (e.style.transform =
            "translate(" + s.clientX + "px, " + s.clientY + "px)"),
          (n = s.clientY),
          (i = s.clientX));
      }),
        jQuery("body").on(
          "mouseenter",
          "a,.edrea_tm_topbar .trigger, .cursor-pointer",
          function () {
            (e.classList.add("cursor-hover"), t.classList.add("cursor-hover"));
          },
        ),
        jQuery("body").on(
          "mouseleave",
          "a,.edrea_tm_topbar .trigger, .cursor-pointer",
          function () {
            (jQuery(this).is("a") &&
              jQuery(this).closest(".cursor-pointer").length) ||
              (e.classList.remove("cursor-hover"),
              t.classList.remove("cursor-hover"));
          },
        ),
        (e.style.visibility = "visible"),
        (t.style.visibility = "visible"));
    }
  }
}

// -----------------------------------------------------
// ---------------    IMAGE TO SVG    ------------------
// -----------------------------------------------------

function edrea_tm_imgtosvg() {
  "use strict";

  jQuery("img.svg").each(function () {
    var jQueryimg = jQuery(this);
    var imgClass = jQueryimg.attr("class");
    var imgURL = jQueryimg.attr("src");

    jQuery.get(
      imgURL,
      function (data) {
        // Get the SVG tag, ignore the rest
        var jQuerysvg = jQuery(data).find("svg");

        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== "undefined") {
          jQuerysvg = jQuerysvg.attr("class", imgClass + " replaced-svg");
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        jQuerysvg = jQuerysvg.removeAttr("xmlns:a");

        // Replace image with new SVG
        jQueryimg.replaceWith(jQuerysvg);
      },
      "xml",
    );
  });
}

// -----------------------------------------------------
// --------------------   POPUP    ---------------------
// -----------------------------------------------------

function edrea_tm_popup() {
  "use strict";

  jQuery(".gallery_zoom").each(function () {
    // the containers for all your galleries
    jQuery(this).magnificPopup({
      delegate: "a.zoom", // the selector for gallery item
      type: "image",
      gallery: {
        enabled: true,
      },
      removalDelay: 300,
      mainClass: "mfp-fade",
    });
  });
  jQuery(".popup-youtube, .popup-vimeo").each(function () {
    // the containers for all your galleries
    jQuery(this).magnificPopup({
      disableOn: 700,
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false,
    });
  });

  jQuery(".soundcloude_link").magnificPopup({
    type: "image",
    gallery: {
      enabled: true,
    },
  });
}

// -----------------------------------------------------
// ---------------   DATA IMAGES    --------------------
// -----------------------------------------------------

function edrea_tm_data_images() {
  "use strict";

  var data = jQuery("*[data-img-url]");

  data.each(function () {
    var element = jQuery(this);
    var url = element.data("img-url");
    element.css({
      backgroundImage: "url(" + url + ")",
    });
  });
}

// -----------------------------------------------------
// ----------------    CONTACT FORM    -----------------
// -----------------------------------------------------

function edrea_tm_contact_form() {
  "use strict";

  jQuery("#sendMessageButton").on("click", function (event) {
    event.preventDefault(); // Prevent the default behavior of the anchor link

    // Get the form element
    var $form = jQuery(this).closest("form");

    // Validate form fields
    var name = $form.find('input[name="Name"]').val();
    var email = $form.find('input[name="Email"]').val();
    var message = $form.find('textarea[name="Message"]').val();

    // Email validation using a regular expression
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      // Display error message for invalid email
      $form
        .find(".email_error")
        .html(
          '<span class="contact_error">Please enter a valid email address.</span>',
        );
      return; // Stop form submission
    } else {
      $form.find(".email_error").empty(); // Clear any previous error messages
    }

    if (!name || !email || !message) {
      // Display error message for empty fields
      $form.find(".empty_notice").slideDown(500).delay(2000).slideUp(500);
      return; // Stop form submission
    }

    // If all fields are filled and email is valid, submit the form via AJAX
    var actionUrl = $form.attr("action");
    var formData = new FormData($form[0]);

    // Update button text to show loading state
    var originalBtnText = $form.find("#sendMessageButton").html();
    $form
      .find("#sendMessageButton")
      .html("Sending... <i class='icon-spin'></i>");

    fetch(actionUrl, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then(function (response) {
        if (response.ok) {
          $form.find(".first, .last, .edrea_tm_button").slideUp(300);
          $form.find(".return_message").slideDown(300);
          $form[0].reset();
        } else {
          $form
            .find(".empty_notice")
            .html("<span>An error occurred. Please try again.</span>")
            .slideDown(500)
            .delay(2000)
            .slideUp(500);
          $form.find("#sendMessageButton").html(originalBtnText);
        }
      })
      .catch(function (error) {
        $form
          .find(".empty_notice")
          .html("<span>Network error. Please try again.</span>")
          .slideDown(500)
          .delay(2000)
          .slideUp(500);
        $form.find("#sendMessageButton").html(originalBtnText);
      });
  });
}

jQuery(document).ready(function () {
  // Call the function when the DOM is ready
  edrea_tm_contact_form();
});

// -----------------------------------------------------
// --------------    OWL CAROUSEL    -------------------
// -----------------------------------------------------

// Owl Carousel removed — testimonial carousel HTML is commented out.
// Stub prevents errors when edrea_tm_about_popup calls this function.
function edrea_tm_mycarousel() {
  "use strict";
  // No-op: owl-carousel markup is not in the DOM.
}

// -----------------------------------------------------
// -------------------    HASHTAG    -------------------
// -----------------------------------------------------

function hashtag() {
  "use strict";
  var ccc = jQuery(".edrea_tm_header .menu .ccc");
  var element = jQuery(".edrea_tm_header .menu .active a");
  jQuery(".edrea_tm_header .menu a").on("mouseenter", function () {
    var e = jQuery(this);
    currentLink(ccc, e);
  });
  jQuery(".edrea_tm_header .menu").on("mouseleave", function () {
    element = jQuery(".edrea_tm_header .menu .active a");
    currentLink(ccc, element);
    element.parent().siblings().removeClass("mleave");
  });
  currentLink(ccc, element);
}

function currentLink(ccc, e) {
  "use strict";
  if (!e.length) {
    return false;
  }
  var left = e.offset().left;
  var width = e.outerWidth();
  var menuleft = jQuery(".edrea_tm_header .menu").offset().left;
  e.parent().removeClass("mleave");
  e.parent().siblings().addClass("mleave");
  ccc.css({
    left: left - menuleft + "px",
    width: width + "px",
  });
}

// -----------------------------------------------------
// ---------------   SWIPER SLIDER    ------------------
// -----------------------------------------------------

function edrea_tm_swiper() {
  "use strict";

  jQuery(".swiper-section").each(function () {
    var element = jQuery(this);
    // Swiper v12: container class changed from .swiper-container to .swiper
    var containerEl = element.find(".swiper")[0];
    var progressDOM = element.find(".edrea_tm_swiper_progress");

    var mySwiper = new Swiper(containerEl, {
      loop: false,
      slidesPerView: 1,
      spaceBetween: 0,
      autoplay: {
        delay: 6000,
      },

      navigation: {
        nextEl: ".my_next",
        prevEl: ".my_prev",
      },

      on: {
        init: function (swiper) {
          updatePagination(this);
        },
        slideChange: function (swiper) {
          updatePagination(this);
        },
      },
      breakpoints: {
        700: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });

    function updatePagination(swiper) {
      if (!swiper || !swiper.slides) return;
      var current = swiper.realIndex + 1;
      var total = swiper.slides.length;
      var scale, translateX;
      if (progressDOM.hasClass("fill")) {
        translateX = "0px";
        scale = parseInt((current / total) * 100) / 100;
      } else {
        scale = parseInt((1 / total) * 100) / 100;
        translateX =
          ((current - 1) * parseInt((100 / total) * 100)) / 100 + "px";
      }

      progressDOM.find(".all span").css({
        transform:
          "translate3d(" +
          translateX +
          ",0px,0px) scaleX(" +
          scale +
          ") scaleY(1)",
      });
      progressDOM.find(".current").html(current < 10 ? "0" + current : current);
      progressDOM.find(".total").html(total < 10 ? "0" + total : total);
    }
  });
  edrea_tm_imgtosvg();
}

// -------------------------------------------------
// -----------------  LOCATION  --------------------
// -------------------------------------------------

function edrea_tm_location() {
  "use strict";

  var button = jQuery(".href_location");
  button.on("click", function () {
    var element = jQuery(this);
    var address = element.text();
    address = address.replace(/\ /g, "+");
    var text = "https://maps.google.com?q=";
    window.open(text + address);
    return false;
  });
}

// -----------------------------------------------------
// ---------------------   SWITCHERS    ----------------
// -----------------------------------------------------

function edrea_tm_color_switcher() {
  "use strict";

  var list = jQuery(".edrea_tm_settings .colors li a");

  list.on("click", function () {
    var element = jQuery(this);
    var elval = element.attr("class");
    element.closest(".edrea_tm_all_wrap").attr("data-color", "" + elval + "");
    //		edrea_tm_circular_progress();
    return false;
  });
}

function edrea_tm_cursor_switcher() {
  "use strict";

  var wrapper = jQuery(".edrea_tm_all_wrap");
  var button = jQuery(".edrea_tm_settings .cursor li a");
  var show = jQuery(".edrea_tm_settings .cursor li a.show");
  var hide = jQuery(".edrea_tm_settings .cursor li a.hide");

  button.on("click", function () {
    var element = jQuery(this);
    if (!element.hasClass("showme")) {
      button.removeClass("showme");
      element.addClass("showme");
    }
    return false;
  });
  show.on("click", function () {
    wrapper.attr("data-magic-cursor", "");
  });
  hide.on("click", function () {
    wrapper.attr("data-magic-cursor", "hide");
  });
}

function edrea_tm_switcher_opener() {
  "use strict";

  var settings = jQuery(".edrea_tm_settings");
  var button = settings.find(".link");

  button.on("click", function () {
    var element = jQuery(this);
    if (element.hasClass("opened")) {
      element.removeClass("opened");
      element.closest(".edrea_tm_settings").removeClass("opened");
    } else {
      element.addClass("opened");
      element.closest(".edrea_tm_settings").addClass("opened");
    }
    return false;
  });
}

// -----------------------------------------------------
// ---------------   HEADLINE ANIMATION  ---------------
// -----------------------------------------------------
// Restored from plugins.js (removed during cleanup) — modernized to use jQuery

function edrea_tm_headline() {
  "use strict";

  if (!jQuery(".cd-headline").length) return; // Guard: no animated headline present

  var animationDelay = 2500,
    barAnimationDelay = 3800,
    barWaiting = barAnimationDelay - 3000,
    lettersDelay = 50,
    typeLettersDelay = 150,
    selectionDuration = 500,
    typeAnimationDelay = selectionDuration + 800,
    revealDuration = 600,
    revealAnimationDelay = 1500;

  initHeadline();

  function initHeadline() {
    singleLetters(jQuery(".cd-headline.letters").find("b"));
    animateHeadline(jQuery(".cd-headline"));
  }

  function singleLetters(words) {
    words.each(function () {
      var word = jQuery(this),
        letters = word.text().split(""),
        selected = word.hasClass("is-visible");
      for (var i in letters) {
        if (word.parents(".rotate-2").length > 0)
          letters[i] = "<em>" + letters[i] + "</em>";
        letters[i] = selected
          ? '<i class="in">' + letters[i] + "</i>"
          : "<i>" + letters[i] + "</i>";
      }
      word.html(letters.join("")).css("opacity", 1);
    });
  }

  function animateHeadline(headlines) {
    var duration = animationDelay;
    headlines.each(function () {
      var headline = jQuery(this);
      if (headline.hasClass("loading-bar")) {
        duration = barAnimationDelay;
        setTimeout(function () {
          headline.find(".cd-words-wrapper").addClass("is-loading");
        }, barWaiting);
      } else if (headline.hasClass("clip")) {
        var spanWrapper = headline.find(".cd-words-wrapper"),
          newWidth = spanWrapper.width() + 10;
        spanWrapper.css("width", newWidth);
      } else if (!headline.hasClass("type")) {
        var words = headline.find(".cd-words-wrapper b"),
          width = 0;
        words.each(function () {
          var wordWidth = jQuery(this).width();
          if (wordWidth > width) width = wordWidth;
        });
        headline.find(".cd-words-wrapper").css("width", width);
      }
      setTimeout(function () {
        hideWord(headline.find(".is-visible").eq(0));
      }, duration);
    });
  }

  function hideWord(word) {
    var nextWord = takeNext(word);
    if (word.parents(".cd-headline").hasClass("type")) {
      var parentSpan = word.parent(".cd-words-wrapper");
      parentSpan.addClass("selected").removeClass("waiting");
      setTimeout(function () {
        parentSpan.removeClass("selected");
        word
          .removeClass("is-visible")
          .addClass("is-hidden")
          .children("i")
          .removeClass("in")
          .addClass("out");
      }, selectionDuration);
      setTimeout(function () {
        showWord(nextWord, typeLettersDelay);
      }, typeAnimationDelay);
    } else if (word.parents(".cd-headline").hasClass("letters")) {
      var bool = word.children("i").length >= nextWord.children("i").length;
      hideLetter(word.find("i").eq(0), word, bool, lettersDelay);
      showLetter(nextWord.find("i").eq(0), nextWord, bool, lettersDelay);
    } else if (word.parents(".cd-headline").hasClass("clip")) {
      word
        .parents(".cd-words-wrapper")
        .animate({ width: "2px" }, revealDuration, function () {
          switchWord(word, nextWord);
          showWord(nextWord);
        });
    } else if (word.parents(".cd-headline").hasClass("loading-bar")) {
      word.parents(".cd-words-wrapper").removeClass("is-loading");
      switchWord(word, nextWord);
      setTimeout(function () {
        hideWord(nextWord);
      }, barAnimationDelay);
      setTimeout(function () {
        word.parents(".cd-words-wrapper").addClass("is-loading");
      }, barWaiting);
    } else {
      switchWord(word, nextWord);
      setTimeout(function () {
        hideWord(nextWord);
      }, animationDelay);
    }
  }

  function showWord(word, duration) {
    if (word.parents(".cd-headline").hasClass("type")) {
      showLetter(word.find("i").eq(0), word, false, duration);
      word.addClass("is-visible").removeClass("is-hidden");
    } else if (word.parents(".cd-headline").hasClass("clip")) {
      word
        .parents(".cd-words-wrapper")
        .animate({ width: word.width() + 10 }, revealDuration, function () {
          setTimeout(function () {
            hideWord(word);
          }, revealAnimationDelay);
        });
    }
  }

  function hideLetter(letter, word, bool, duration) {
    letter.removeClass("in").addClass("out");
    if (!letter.is(":last-child")) {
      setTimeout(function () {
        hideLetter(letter.next(), word, bool, duration);
      }, duration);
    } else if (bool) {
      setTimeout(function () {
        hideWord(takeNext(word));
      }, animationDelay);
    }
    if (
      letter.is(":last-child") &&
      jQuery("html").hasClass("no-csstransitions")
    ) {
      switchWord(word, takeNext(word));
    }
  }

  function showLetter(letter, word, bool, duration) {
    letter.addClass("in").removeClass("out");
    if (!letter.is(":last-child")) {
      setTimeout(function () {
        showLetter(letter.next(), word, bool, duration);
      }, duration);
    } else {
      if (word.parents(".cd-headline").hasClass("type")) {
        setTimeout(function () {
          word.parents(".cd-words-wrapper").addClass("waiting");
        }, 200);
      }
      if (!bool)
        setTimeout(function () {
          hideWord(word);
        }, animationDelay);
    }
  }

  function takeNext(word) {
    return !word.is(":last-child")
      ? word.next()
      : word.parent().children().eq(0);
  }

  function switchWord(oldWord, newWord) {
    oldWord.removeClass("is-visible").addClass("is-hidden");
    newWord.removeClass("is-hidden").addClass("is-visible");
  }
}

// -------------------------------------------------
// ---------------   SOCIAL GRAPH  -----------------
// -------------------------------------------------
function fimarx_social_graph() {
  "use strict";
  var canvasElement = document.getElementById("fimarxSocialGraph");
  if (!canvasElement) return;

  var ctx = canvasElement.getContext("2d");

  var brandColors = [
    "#FFFC00", // Snapchat
    "#FF0000", // YouTube
    "#00f2fe", // TikTok
    "#E1306C", // Instagram
  ];

  // 👉 UPDATE THESE NUMBERS MANUALLY
  var currentFollowers = [239, 5606, 112, 5082]; // Current follower number
  var previousFollowers = [230, 5000, 100, 5000]; // Last month numbers

  // -------------------------------------------------
  // Automatically calculates percentage for the badge
  // -------------------------------------------------
  var currentTotal = currentFollowers.reduce(function (a, b) {
    return a + b;
  }, 0);
  var previousTotal = previousFollowers.reduce(function (a, b) {
    return a + b;
  }, 0);

  var growthBadge = document.getElementById("growthPercentageBadge");
  if (growthBadge && previousTotal > 0) {
    var diff = currentTotal - previousTotal;
    var percentage = (diff / previousTotal) * 100;
    var formattedPercentage = percentage.toFixed(1);

    if (percentage >= 0) {
      growthBadge.innerHTML =
        "+" +
        formattedPercentage +
        "% <i class='fa-solid fa-arrow-trend-up'></i>";
      growthBadge.className = "growth_badge positive";
    } else {
      growthBadge.innerHTML =
        formattedPercentage + "% <i class='fa-solid fa-arrow-trend-down'></i>";
      growthBadge.className = "growth_badge negative";
    }
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Snapchat", "YouTube", "TikTok", "Instagram"],
      datasets: [
        {
          label: "Followers",
          data: currentFollowers,
          backgroundColor: brandColors,
          borderWidth: 0,
          borderRadius: 6,
          barPercentage: 0.6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          bodyFont: { family: "'Inter', sans-serif", size: 14 },
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { display: true, color: "rgba(255, 255, 255, 0.05)" },
          ticks: {
            color: "rgba(255, 255, 255, 0.5)",
            font: { family: "'Inter', sans-serif" },
            padding: 10,
          },
          border: { display: false },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: { family: "'Inter', sans-serif" },
            padding: 10,
          },
          border: { display: false },
        },
      },
    },
  });
}
