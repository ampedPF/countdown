var data = {};
const countdownEl = document.getElementById('countdown');

let milliseconds = 0;
let timeLeft = 0;

function loadJSON() {
    return $.getJSON('./config.json');
}

function updateTimer() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    document.getElementById('countdown').innerHTML = `${minutes}:${seconds}`;
    time--;
}

function updateCountdown() {
    milliseconds = endDate - new Date();
    timeLeft = convertMilliseconds(milliseconds);
    document.getElementById('countdown').innerHTML = formatTimeLeftString(timeLeft);
}

function formatTimeString(timeStr) {
    return ('0' + timeStr).slice(-2);
}

function formatTimeLeftString(timeLeft) {
    return timeLeft.d + data.separators.days +
        formatTimeString(timeLeft.h) + data.separators.hours +
        formatTimeString(timeLeft.m) + data.separators.minutes +
        formatTimeString(timeLeft.s) + data.separators.seconds;
}

// https://gist.github.com/flangofas/714f401b63a1c3d84aaa#file-convertms-js
function convertMilliseconds(milliseconds, format) {
    var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

    total_seconds = parseInt(Math.floor(milliseconds / 1000));
    total_minutes = parseInt(Math.floor(total_seconds / 60));
    total_hours = parseInt(Math.floor(total_minutes / 60));
    days = parseInt(Math.floor(total_hours / 24));

    seconds = parseInt(total_seconds % 60);
    minutes = parseInt(total_minutes % 60);
    hours = parseInt(total_hours % 24);

    switch (format) {
        case 's':
            return total_seconds;
        case 'm':
            return total_minutes;
        case 'h':
            return total_hours;
        case 'd':
            return days;
        default:
            return {
                d: days, h: hours, m: minutes, s: seconds
            };
    }
};

$.when(loadJSON())
    .then(function (response) {
        data = response;
        endDate = new Date(data.date + "T" + data.time);
        setInterval(updateCountdown, 1000);
    });