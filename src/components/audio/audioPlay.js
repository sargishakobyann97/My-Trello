import React, { useEffect } from "react"
import playSong from "./soundtracks/play.mp3"
import deleteSong from "./soundtracks/delete.mp3"

let audio

export default function audioPlay(method, type) {

    if (type) {
        let song = playSong
        if (method === "DELETE") song = deleteSong
        audio = new Audio(song);
        onChange()
    }
    return (<></>)
}

function debounce(fn, ms) {
    let timeout;
    return function () {
        const fnCall = () => {
            fn.apply(this, arguments);
        };
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms);
    };
}
onChange = debounce(onChange, 30);

function onChange() {
    audio.play()
}
