const express = require("express");
const axios = require("axios");
const fs = require("node-fs");

const myapikey = process.env.MYAPIKEY;
const airport = process.env.AIRPORT; // EGLL

const url = "https://" + myapikey + "opensky-network.org/api/flights/";

const app = express();

app.locals.pretty = true;

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.set("view engine", "pug");

async function getflightsdetails(url, params) {
  try {
    var response = await axios.get(url, { params });
    console.info(response.status);
    var flights = response.data;

    var details = [];
    if (flights) {
      flights.forEach(flight => {
        var fl = {
          callsign: flight.callsign,
          estDepartureAirport: flight.estDepartureAirport
            ? flight.estDepartureAirport
            : "null",
          estArrivalAirport: flight.estArrivalAirport
            ? flight.estArrivalAirport
            : "null",
          estArrivalAirportHorizDistance: Math.floor(
            flight.estArrivalAirportHorizDistance / 10
          ),
          estArrivalAirportVertDistance: Math.floor(
            flight.estArrivalAirportVertDistance / 1
          ),
          firstSeen: new Date(flight.firstSeen * 1000).toLocaleTimeString(
            "en-GB"
          ),
          lastSeen: new Date(flight.lastSeen * 1000).toLocaleTimeString("en-GB")
        };
        details.push(fl);
      });
    }

    return details;
  } catch (error) {
    console.log(error);
  }
}

async function getFlights() {
  let flightinfo = {
    date: "",
    arrivals: "",
    departures: ""
  };

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  var start = new Date();
  flightinfo.date = start.toLocaleDateString("en-GB", options);
  var start = Math.floor(start / 1000) - 100000;
  var end = start + 10 * 60; // N min window

  var params = { airport: airport, begin: start, end: end };
  var flights = await getflightsdetails(url + "arrival", params);
  if (flights) {
    var s = "";
    flights.forEach(flight => {
      var details = [
        flight.callsign,
        flight.estDepartureAirport,
        flight.estArrivalAirport,
        flight.estArrivalAirportHorizDistance,
        flight.estArrivalAirportVertDistance,
        flight.firstSeen,
        flight.lastSeen
      ];
      s += details.join(" ") + "\n";
    });
    flightinfo.arrivals = s;
  }
  var params = { airport: airport, begin: start, end: end };
  var flights = await getflightsdetails(url + "departure", params);
  if (flights) {
    var s = "";
    flights.forEach(flight => {
      var details = [
        flight.callsign,
        flight.estDepartureAirport,
        flight.estArrivalAirport,
        flight.estArrivalAirportHorizDistance,
        flight.estArrivalAirportVertDistance,
        flight.firstSeen,
        flight.lastSeen
      ];
      s += details.join(" ") + "\n";
    });
    flightinfo.departures = s;
  }

  return flightinfo;
}

app.get("/dynamic/dyncss.css", function(req, res) {
  const backgrounds = ["lightgray", "lightgreen", "lightpurple", "lightpink"];
  var i = Math.floor(Math.random() * backgrounds.length);

  var css = fs.readFileSync("./templates/dyncss.css");
  css = css.toString().replace("%bgcolour%", backgrounds[i]);

  res.write(css);
  res.end();
});

app.get("/dynamic/dynjs.js", async function(req, res) {
  var planes = "dynamic";

  var start = new Date();
  var start = Math.floor(start / 1000) - 100000;
  var end = start + 10 * 60; // N min window

  var s = "";

  var params = { airport: airport, begin: start, end: end };
  var flights = await getflightsdetails(url + "arrival", params);
  if (flights) {
    flights.forEach(flight => {
      var cs = flight.callsign;
      var x = flight.estArrivalAirportHorizDistance;
      var y = flight.estArrivalAirportVertDistance;
      s += `ctx.fillText('${flight.callsign}', -${x}, 300-${y})\n`;
      s += `ctx.drawImage(plane, -${x}, 300-${y})\n`;
    });
  }

  var flights = await getflightsdetails(url + "departure", params);
  if (flights) {
    flights.forEach(flight => {
      var cs = flight.callsign;
      var x = flight.estArrivalAirportHorizDistance;
      var y = flight.estArrivalAirportVertDistance;
      s += `ctx.fillText('${flight.callsign}', ${x}, 300-${y})\n`;
      s += `ctx.drawImage(plane, ${x}, 300-${y})\n`;
    });
  }
  console.log(s);

  var js = fs.readFileSync("./templates/dynjs.js");
  js = js.toString().replace("%planes%", s);

  res.setHeader("content-type", "text/javascript");
  res.write(js);
  res.end();
});

app.get("/", async (_, res) => {
  const flights = await getFlights();
  res.render("index", flights);
});

app.listen(process.env.PORT);
