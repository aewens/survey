require.config
    urlArgs: "nocache=" + (new Date).getTime()
        
require [
], () ->
    console.log "__CODE GOES HERE__"
