const button = document.getElementById('button');
const audio = document.getElementById('audio');

// usimg the software development kit sdk from the voice-rss website for javascript.

"use strict";
var VoiceRSS = {
    speech: function (e) {
        this._validate(e), this._request(e)
    },
    _validate: function (e) {
        if (!e) throw "The settings are undefined";
        if (!e.key) throw "The API key is undefined";
        if (!e.src) throw "The text is undefined";
        if (!e.hl) throw "The language is undefined";
        if (e.c && "auto" != e.c.toLowerCase()) {
            var a = !1;
            switch (e.c.toLowerCase()) {
                case "mp3":
                    a = (new Audio).canPlayType("audio/mpeg").replace("no", "");
                    break;
                case "wav":
                    a = (new Audio).canPlayType("audio/wav").replace("no", "");
                    break;
                case "aac":
                    a = (new Audio).canPlayType("audio/aac").replace("no", "");
                    break;
                case "ogg":
                    a = (new Audio).canPlayType("audio/ogg").replace("no", "");
                    break;
                case "caf":
                    a = (new Audio).canPlayType("audio/x-caf").replace("no", "")
            }
            if (!a) throw "The browser does not support the audio codec " + e.c
        }
    },
    _request: function (e) {
        var a = this._buildRequest(e),
            t = this._getXHR();
        t.onreadystatechange = function () {
            if (4 == t.readyState && 200 == t.status) {
                if (0 == t.responseText.indexOf("ERROR")) throw t.responseText;
                audio.src = t.responseText; // using our audio element and saving the response from the server as its source
                audio.play();   // playing the joke that was responded back to our server.
            }
        }, t.open("POST", "https://api.voicerss.org/", !0), t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), t.send(a)
    },
    _buildRequest: function (e) {
        var a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec();
        return "key=" + (e.key || "") + "&src=" + (e.src || "") + "&hl=" + (e.hl || "") + "&v=" + (e.v || "") + "&r=" + (e.r || "") + "&c=" + (a || "") + "&f=" + (e.f || "") + "&ssml=" + (e.ssml || "") + "&b64=true"
    },
    _detectCodec: function () {
        var e = new Audio;
        return e.canPlayType("audio/mpeg").replace("no", "") ? "mp3" : e.canPlayType("audio/wav").replace("no", "") ? "wav" : e.canPlayType("audio/aac").replace("no", "") ? "aac" : e.canPlayType("audio/ogg").replace("no", "") ? "ogg" : e.canPlayType("audio/x-caf").replace("no", "") ? "caf" : ""
    },
    _getXHR: function () {
        try {
            return new XMLHttpRequest
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml3.XMLHTTP")
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0")
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0")
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP")
        } catch (e) {}
        try {
            return new ActiveXObject("Microsoft.XMLHTTP")
        } catch (e) {}
        throw "The browser does not support HTTP request"
    }
};


//Passing jokes to voice rss api

function tellMe(joke)   // Passing the joke data that was the response from the jokeAPI serve
{
    VoiceRSS.speech({
        key: '43b26b8333174b0e8519d99bb5736e79',
        src: joke,
        hl: 'en-us',
        v: 'Linda',
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
}

// Get random jokes from Joke API

async function getJokes()
{
    let joke = '';

    const apiUrl = 'https://sv443.net/jokeapi/v2/joke/Any';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if(data.setup)      // if it is two part joke, repeat the joke setup and the delivery
        {
            joke = `${data.setup} ... ${data.delivery}`;
        } else  // for one part joke display only the joke
        {
            joke = data.joke;
        }
        // Text-to-Speech
       tellMe(joke);
        // Disable or enabling the button
        toggleButton();
    } catch (error) {
        console.log("whoops the error is : ", error);
    }
}

// Disable or enable button

function toggleButton()
{
    button.disabled = !button.disabled; // if the button is diabled, it will enable it. if enabled, it will disable it. opposite function.
}

// Event Listeners

button.addEventListener('click', getJokes);
audio.addEventListener('ended', toggleButton); // to disable the button once the joke has started and enable it once the joke has ended.

getJokes();