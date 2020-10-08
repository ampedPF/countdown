var data = {};
let countdownEl;

let milliseconds = 0;
let timeLeft = 0;
let updateId = 0;

function loadJSON() {
    return $.getJSON('./config.json');
}

function getDurationInMilliseconds() {
    return parseInt(Math.floor(data.duration.days)) * 24 * 60 * 60 * 1000
            + parseInt(Math.floor(data.duration.hours)) * 60 * 60 * 1000
            + parseInt(Math.floor(data.duration.minutes)) * 60 * 1000
            + parseInt(Math.floor(data.duration.seconds)) * 1000
            + parseInt(Math.floor(data.duration.milliseconds));
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

function formatTimeString(timeStr, count) {
    var prefix;
    for (i = 0; i < count; i++) {
        prefix += "0";
    }
    return (prefix + timeStr).slice(-count);
}

function formatTimeLeftString(timeLeft) {
    negativeSign = (data.overtimeCountdown && milliseconds < 0) ? "-" : "";
    daysLeftString = ((data.displayIfNull.days || timeLeft.d > 0) || (data.overtimeCountdown && timeLeft.d != 0)) ? timeLeft.d + data.suffix.days : "";
    hoursLeftString = ((data.displayIfNull.hours || timeLeft.h > 0) || (data.overtimeCountdown && timeLeft.h != 0)) ? formatTimeString(timeLeft.h, 2) + data.suffix.hours : "";
    minutesLeftString = ((data.displayIfNull.minutes || timeLeft.m > 0) || (data.overtimeCountdown && timeLeft.m != 0)) ? formatTimeString(timeLeft.m, 2) + data.suffix.minutes : "";
    secondsLeftString = ((data.displayIfNull.seconds || timeLeft.s > 0) || (data.overtimeCountdown && timeLeft.s != 0)) ? formatTimeString(timeLeft.s, 2) + data.suffix.seconds : "";
    millisecondsLeftString = (data.displayMilliseconds && ((data.displayIfNull.milliseconds || timeLeft.ms > 0) || (data.overtimeCountdown && timeLeft.ms != 0))) ? formatTimeString(timeLeft.ms, 3) + data.suffix.milliseconds : "";
    return negativeSign + daysLeftString + hoursLeftString + minutesLeftString + secondsLeftString + millisecondsLeftString;
}

// https://gist.github.com/flangofas/714f401b63a1c3d84aaa#file-convertms-js
function convertMilliseconds(milliseconds, format) {
    let days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

    milliseconds = Math.abs(milliseconds);
    total_seconds = parseInt(Math.floor(milliseconds / 1000));
    total_minutes = parseInt(Math.floor(total_seconds / 60));
    total_hours = parseInt(Math.floor(total_minutes / 60));
    days = parseInt(Math.floor(total_hours / 24));

    milliseconds = parseInt(milliseconds % 1000);
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
                d: days, h: hours, m: minutes, s: seconds, ms: milliseconds
            };
    }
};

$.getJSON('./config.json', function (response) {
    data = response;
}).fail(function () {
    console.log("An error has occurred.");
}).then(function () {
countdownEl = document.getElementById('countdown');

endDate = data.useDuration ? Date.now() + getDurationInMilliseconds() : new Date(data.date + "T" + data.time);
updateCountdown();
updateId = setInterval(updateCountdown, 1000);
});