require.config
    urlArgs: "nocache=" + (new Date).getTime()
    paths:
        jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min"
        firebase: "https://cdn.firebase.com/js/client/2.3.1/firebase"
    shim:
        firebase:
            exports: "Firebase"
require [
    "jquery",
    "firebase"
], ($, Firebase) ->
    ref = new Firebase("https://zccount-survey.firebaseio.com/")

    luminance = (color, lum) ->
        rgb = color.replace(/\s/g,"").match(/^rgba?\((\d+),(\d+),(\d+)/i)

        R = rgb[1]
        G = rgb[2]
        B = rgb[3]

        R = parseInt(R * (100 + lum) / 100)
        G = parseInt(G * (100 + lum) / 100)
        B = parseInt(B * (100 + lum) / 100)

        R = if R < 255 then R else 255
        G = if G < 255 then G else 255
        B = if B < 255 then B else 255

        RR = if R.toString(16).length is 1
            "0"+R.toString(16)
        else
            R.toString(16)
        GG = if G.toString(16).length is 1
            "0"+G.toString(16)
        else
            G.toString(16)
        BB = if B.toString(16).length == 1
            "0"+B.toString(16)
        else
            B.toString(16)

        return "#"+RR+GG+BB

    $("li:not(#assign)").hide()

    $("#name").on "keyup", (e) ->
        disable = !($(this).val().length is 8)
        if disable
            $("#name").removeClass("active")
            $("li:not(#assign)").slideUp()
        else
            $("#name").addClass("active")
            $(this).parent().siblings().slideDown()

    for i in [0...36]
        $("<div/>",{"data-id":i}).addClass("cell").appendTo(".grid")

    $(".cell").on "click", (e) ->
        $(this).toggleClass("select")

    $(".shades, hr").hide()

    $(".color").on "click", (e) ->
        $(this).parent().parent().children(".options").each ->
            $(this).children().each ->
                $(this).removeClass("select")
        $(this).addClass("select")
        color = $(this).css("background")
        $hr = $(this).parent().siblings("hr")
        $shades = $(this).parent().siblings(".shades")

        $hr.slideDown()
        $shades.slideDown()

        $light = $shades.children("#light")
        $normal = $shades.children("#normal")
        $dark = $shades.children("#dark")

        $normal.css("background", color)
        $light.css("background", luminance(color, 50))
        $dark.css("background", luminance(color, -50))
