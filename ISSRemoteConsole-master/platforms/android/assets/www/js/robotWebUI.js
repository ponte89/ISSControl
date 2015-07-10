var speed = 0;
var speedRobot = "Low";
var sock;

function setLocation(el) {
    document.getElementById("location").value = el.value;
}

function setSpeed(sp) {
    switch (sp) {
        case 20:
            speed = sp;
            speedRobot = "Low";
            break;
        case 50:
            speed = sp;
            speedRobot = "Medium";
            break;
        case 100:
            speed = sp;
            speedRobot = "High";
            break;
        default:
            speed = 20;
            speedRobot = "Low";
    }
    speed = sp;
    document.getElementById("speed").value = speed + "%";
}

function setWs() {
    if ("WebSocket" in window) {
        var loc = document.getElementById("location").value;
        if (loc === "") {
            loc = "localhost:8080";
        }
        sock = new WebSocket("ws://" + loc, "protocolOne");
        sock.onopen = function() {
            document.getElementById("main").style.display = "block";
            document.getElementById("index").style.display = "none";
        };
        sock.onmessage = function(evt) {
            var received_msg = evt.data;
        };
        sock.onerror = function(error) {
            alert("Connection Error");
        }
    } else {
        alert("Your does not support WebSocket");
        navigator.app.exitApp();
    }
}

function sendWs(what) {
    if (what.indexOf("-") >= 0) {
        what += speedRobot;
    }
    sock.send(what);
}

function show(who) {
	document.getElementById(who).style.display = "block";
}

function hide(who) {
	document.getElementById(who).style.display = "none";
}
