var data = {};
let countdownEl = document.getElementById('countdown');

let milliseconds = 0;
let timeLeft = 0;
let updateId = 0;

function loadJSON() {
    return $.getJSON('./config.json');
}

function updateCountdown() {
    milliseconds = endDate - new Date();
    if (milliseconds > 0 || data.overtimeCountdown) {
        timeLeft = convertMilliseconds(milliseconds);
        countdownEl.innerHTML = formatTimeLeftString(timeLeft);
    } else {
        countdownEl.innerHTML = formatTimeLeftString(convertMilliseconds(0));
        clearInterval(updateId);
    }
}

function formatTimeString(timeStr) {
    return ('0' + timeStr).slice(-2);
}

function formatTimeLeftString(timeLeft) {
    negativeSign = (data.overtimeCountdown && milliseconds < 0) ? "-" : "";
    daysLeftString = ((data.displayIfNull.days || timeLeft.d > 0) || (data.overtimeCountdown && timeLeft.d != 0)) ? timeLeft.d + data.separators.days : "";
    hoursLeftString = ((data.displayIfNull.hours || timeLeft.h > 0) || (data.overtimeCountdown && timeLeft.h != 0)) ? formatTimeString(timeLeft.h) + data.separators.hours : "";
    minutesLeftString = ((data.displayIfNull.minutes || timeLeft.m > 0) || (data.overtimeCountdown && timeLeft.m != 0)) ? formatTimeString(timeLeft.m) + data.separators.minutes : "";
    secondsLeftString = ((data.displayIfNull.seconds || timeLeft.s > 0) || (data.overtimeCountdown && timeLeft.s != 0)) ? formatTimeString(timeLeft.s) + data.separators.seconds : "";
    return negativeSign + daysLeftString + hoursLeftString + minutesLeftString + secondsLeftString;
}

// https://gist.github.com/flangofas/714f401b63a1c3d84aaa#file-convertms-js
function convertMilliseconds(milliseconds, format) {
    var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

    total_seconds = parseInt(Math.floor(Math.abs(milliseconds) / 1000));
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
        countdownEl = document.getElementById('countdown');
        endDate = new Date(data.date + "T" + data.time);
        updateCountdown();
        updateId = setInterval(updateCountdown, 1000);
    });