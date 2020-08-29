var data = {};

function loadJSON() {
    return $.getJSON('./config.json');
}

function main() {

    $.when(loadJSON())
        .then(function (response) {
            data = response;
        })
        .then(function () {
            document.getElementById("date").innerHTML = data.date;
            document.getElementById("time").innerHTML = data.time;

        });

}

$(document).ready(main);