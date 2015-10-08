// Generated by CoffeeScript 1.10.0
(function() {
  require.config({
    urlArgs: "nocache=" + (new Date).getTime(),
    paths: {
      jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min",
      firebase: "https://cdn.firebase.com/js/client/2.3.1/firebase"
    },
    shim: {
      firebase: {
        exports: "Firebase"
      }
    }
  });

  require(["jquery", "firebase"], function($, Firebase) {
    var i, j, luminance, ref;
    ref = new Firebase("https://zccount-survey.firebaseio.com/");
    luminance = function(color, lum) {
      var B, BB, G, GG, R, RR, rgb;
      rgb = color.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+)/i);
      R = rgb[1];
      G = rgb[2];
      B = rgb[3];
      R = parseInt(R * (100 + lum) / 100);
      G = parseInt(G * (100 + lum) / 100);
      B = parseInt(B * (100 + lum) / 100);
      R = R < 255 ? R : 255;
      G = G < 255 ? G : 255;
      B = B < 255 ? B : 255;
      RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
      GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
      BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);
      return "#" + RR + GG + BB;
    };
    $("li:not(#assign)").hide();
    $("#name").on("keyup", function(e) {
      var disable;
      disable = !($(this).val().length === 8);
      if (disable) {
        $("#name").removeClass("active");
        return $("li:not(#assign)").slideUp();
      } else {
        $("#name").addClass("active");
        return $(this).parent().siblings().slideDown();
      }
    });
    for (i = j = 0; j < 36; i = ++j) {
      $("<div/>", {
        "data-id": i
      }).addClass("cell").appendTo(".grid");
    }
    $(".cell").on("click", function(e) {
      return $(this).toggleClass("select");
    });
    $(".shades, hr").hide();
    return $(".color").on("click", function(e) {
      var $dark, $hr, $light, $normal, $shades, color;
      $(this).parent().parent().children(".options").each(function() {
        return $(this).children().each(function() {
          return $(this).removeClass("select");
        });
      });
      $(this).addClass("select");
      color = $(this).css("background");
      $hr = $(this).parent().siblings("hr");
      $shades = $(this).parent().siblings(".shades");
      $hr.slideDown();
      $shades.slideDown();
      $light = $shades.children("#light");
      $normal = $shades.children("#normal");
      $dark = $shades.children("#dark");
      $normal.css("background", color);
      $light.css("background", luminance(color, 50));
      return $dark.css("background", luminance(color, -50));
    });
  });

}).call(this);
