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
    var demand, i, j, luminance, ref, sref;
    ref = new Firebase("https://zccount-survey.firebaseio.com/");
    sref = ref.child("students");
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
    demand = function($el) {
      var dmd, ret;
      dmd = $el.attr("dmd");
      if (dmd === "ignore") {
        return ["\n"];
      }
      switch (true) {
        case /name/.test(dmd):
          return [$el.find("#name").val().toLowerCase()];
        case /color\d/.test(dmd):
          ret = [];
          $el.find(".select").each(function() {
            return ret.push($(this).attr("data-id"));
          });
          return ret;
        case /grid/.test(dmd):
          ret = [];
          $el.find(".select").each(function() {
            return ret.push($(this).attr("data-id"));
          });
          return ret;
        case /select\d/.test(dmd):
          ret = [];
          $el.find(".result").each(function() {
            return ret.push($(this).text());
          });
          return ret;
      }
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
      var $parent;
      $parent = $(this).parent().parent();
      $parent.removeClass("done");
      $(this).toggleClass("select");
      if ($parent.find(".select").length >= 3) {
        return $parent.addClass("done");
      }
    });
    $(".shades, hr, .result").hide();
    $("select").change(function() {
      var $parent, $result, map, state, text;
      map = $(this).attr("map");
      text = $(this).find(":selected").text();
      $result = $(this).siblings(".result[map=" + map + "]");
      $result.text(text).show();
      state = true;
      $parent = $(this).parent();
      $parent.find(".result").each(function() {
        if (!($(this).text().length > 0)) {
          return state = false;
        }
      });
      if (state) {
        return $parent.parent().addClass("done");
      }
    });
    $(".colors .color").on("click", function(e) {
      var $dark, $hr, $light, $normal, $shades, color;
      $(this).siblings().each(function() {
        return $(this).removeClass("select");
      });
      $(this).addClass("select");
      color = $(this).css("background");
      $hr = $(this).parent().siblings("hr");
      $shades = $(this).parent().siblings(".shades");
      $hr.slideDown();
      $shades.slideDown();
      $light = $shades.children("[data-id=light]");
      $normal = $shades.children("[data-id=normal]");
      $dark = $shades.children("[data-id=dark]");
      $normal.css("background", color);
      $light.css("background", luminance(color, 50));
      return $dark.css("background", luminance(color, -50));
    });
    $(".shades .color").on("click", function(e) {
      $(this).siblings().each(function() {
        return $(this).removeClass("select");
      });
      $(this).addClass("select");
      return $(this).parent().parent().addClass("done");
    });
    $("li").on("click", function(e) {
      var state;
      state = false;
      $("li:not([done-ignore])").each(function() {
        if (!$(this).hasClass("done")) {
          return state = true;
        }
      });
      return $(".submit").prop("disabled", state);
    });
    return $(".submit").on("click", function(e) {
      var data, student;
      student = demand($("[dmd=name]"))[0];
      data = {};
      $(".survey ul").children(":not([done-ignore])").each(function() {
        return data["" + ($(this).attr("dmd"))] = demand($(this));
      });
      sref.child(student).set(data);
      return window.location.reload();
    });
  });

}).call(this);
