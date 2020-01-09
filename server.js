const express = require("express");
const axios = require("axios");

const airport = process.env.AIRPORT; // EGLL

const app = express();

app.locals.pretty = true;

app.set("view engine", "pug")

app.get("/", async (_, res) => {
  const flights = await getFlights()
  res.render("index", flights)
});

async function getFlights() {
  let flights = {
    date: "",
    arrivals: "",
    departures: ""
  };

  var start = new Date();
  flights.date = start;
  var start = Math.floor(start / 1000) - 200000;
  var end = start + 300;

  try {
    const url = "https://opensky-network.org/api/flights/";

    var params = { airport: airport, begin: start, end: end };
    var response = await axios.get(url + "arrival", { params });
    console.log(response.status);

    var data = response.data;
    var s = "";

    for (let i = 0; i < data.length; i++) {
      s = s + data[i].callsign + " ";
      s = s + data[i].estDepartureAirport + " ";
      s = s + data[i].estArrivalAirport + " ";
      s = s + data[i].estArrivalAirportHorizDistance + " ";
      s = s + data[i].estArrivalAirportVertDistance + " ";
      s = s + "\n";
    }

    flights.arrivals = s;

    params = { airport: airport, begin: start, end: end };
    var response = await axios.get(url + "departure", { params });
    console.log(response.status);

    var data = response.data;
    var s = "";

    for (let i = 0; i < data.length; i++) {
      s = s + data[i].callsign + " ";
      s = s + data[i].estDepartureAirport + " ";
      s = s + data[i].estArrivalAirport + " ";
      s = s + data[i].estArrivalAirportHorizDistance + " ";
      s = s + data[i].estArrivalAirportVertDistance + "\n";
    }

    flights.departures = s;

    return flights;
  } catch (error) {
    console.log(error);
  }
}

app.listen(process.env.PORT);
