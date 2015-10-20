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
    sref = ref.child("students")

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

    demand = ($el) ->
        dmd = $el.attr("dmd")
        return ["\n"] if dmd is "ignore"

        switch true
            when /name/.test(dmd)
                return [$el.find("#name").val().toLowerCase()]
            when /color\d/.test(dmd)
                ret = []
                $el.find(".select").each ->
                    ret.push $(this).attr("data-id")
                return ret
            when /grid/.test(dmd)
                ret = []
                $el.find(".select").each ->
                    ret.push $(this).attr("data-id")
                return ret
            when /select\d/.test(dmd)
                ret = []
                $el.find(".result").each ->
                    ret.push $(this).text()
                return ret

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
        $parent = $(this).parent().parent()
        $parent.removeClass("done")
        $(this).toggleClass("select")
        $parent.addClass("done") if $parent.find(".select").length >= 3

    $(".shades, hr, .result").hide()

    $("select").change ->
        map = $(this).attr("map")
        text = $(this).find(":selected").text()
        $result = $(this).siblings(".result[map=#{map}]")
        $result.text(text).show()
        state = true
        $parent = $(this).parent()
        $parent.find(".result").each ->
            state = false unless $(this).text().length > 0
        $parent.parent().addClass("done") if state

    $(".colors .color").on "click", (e) ->
        $(this).siblings().each ->
            $(this).removeClass("select")
        $(this).addClass("select")
        color = $(this).css("background")
        $hr = $(this).parent().siblings("hr")
        $shades = $(this).parent().siblings(".shades")

        $hr.slideDown()
        $shades.slideDown()

        $light = $shades.children("[data-id=light]")
        $normal = $shades.children("[data-id=normal]")
        $dark = $shades.children("[data-id=dark]")

        $normal.css("background", color)
        $light.css("background", luminance(color, 50))
        $dark.css("background", luminance(color, -50))

    $(".shades .color").on "click", (e) ->
        $(this).siblings().each ->
            $(this).removeClass("select")
        $(this).addClass("select")
        $(this).parent().parent().addClass("done")

    $("li").on "click", (e) ->
        state = false
        $("li:not([done-ignore])").each ->
            state = true unless $(this).hasClass("done")
        $(".submit").prop "disabled", state

    $(".submit").on "click", (e) ->
        student = demand($("[dmd=name]"))[0]
        data = {}
        $(".survey ul").children(":not([done-ignore])").each ->
            data["#{$(this).attr("dmd")}"] = demand($(this))
        sref.child(student).set(data)
        window.location.reload()
