const express = require("express");
const axios = require("axios");

const url = "https://opensky-network.org/api/flights/";
const airport = process.env.AIRPORT; // EGLL

const app = express();

app.locals.pretty = true;

app.set("view engine", "pug");

app.get("/", async (_, res) => {
  const flights = await getFlights();
  res.render("index", flights);
});

async function getflightsdetails(url, params) {
  var response = await axios.get(url, { params });
  console.log(response.status);
  var flights = response.data;

  var s = "";
  if (flights) {
    flights.forEach(flight => {
      var details = [
        flight.callsign,
        flight.estDepartureAirport,
        flight.estArrivalAirport,
        flight.estArrivalAirportHorizDistance,
        flight.estArrivalAirportVertDistance
      ];
      s = s + details.join(" ") + "\n";
    });
  }

  return s;
}

async function getFlights() {
  let flightinfo = {
    date: "",
    arrivals: "",
    departures: ""
  };

  var start = new Date();
  flightinfo.date = start;
  var start = Math.floor(start / 1000) - 100000;
  var end = start + 10*60; // N min window

  try {
    var params = { airport: airport, begin: start, end: end };
    flightinfo.arrivals = await getflightsdetails(url + "arrival", params);

    params = { airport: airport, begin: start, end: end };
    flightinfo.departures = await getflightsdetails(url + "departure", params);

    return flightinfo;
  } catch (error) {
    console.log(error);
  }
}

app.listen(process.env.PORT);
