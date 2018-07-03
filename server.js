// server.js Express server running in node

require("dotenv").config(); // read the .env file
const express = require("express");
const {
  getRates,
  getSymbols,
  getHistoricalRate
} = require("./lib/fixer-service");
const { convertCurrency } = require("./lib/free-currency-service");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

// ==================================================================== //
// ==================  Express Middleware ============================= //
// ==================================================================== //
// ----------------------------------------------------------------------------- //

// Set public folder as root
app.use(express.static("public"));

// Allow front-end access to node_modules folder
app.use("/scripts", express.static(`${__dirname}/node_modules/`));

// Parse POST data as URL encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Parse POST data as JSON
app.use(bodyParser.json());

// ==================================================================== //
// ==================  End Middleware ================================= //
// ==================================================================== //
// ----------------------------------------------------------------------------- //

// ==================================================================== //
// ==================  Express Error Handler ========================== //
// ==================================================================== //
const errorHandler = (err, req, res) => {
  if (err.response) {
    // The Request was made and the server responded with a status code
    // that fails out of the range 2xx
    res
      .status(403)
      .send({ title: "Server responded with an error", message: err.message });
  } else if (err.request) {
    // The request was made but no response was received
    res.status(503).send({
      title: "Unable to communicate with server",
      message: err.message
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    res
      .status(500)
      .send({ title: "An unexpected error occurred", message: err.message });
  }
};
// ==================================================================== //
// ================= End Express Error Handler ======================== //
// ==================================================================== //

// ============================================================================= //
// ================ ***** Express Routes Here ***** ============================ //
// ============================================================================= //
// ----------------------------------------------------------------------------- //

// ==================================================================== //
// ============== Fetch Latest Currency Rates Route =================== //
// ==================================================================== //
/* jshint ignore:start */
app.get("/api/rates", async (req, res) => {
  try {
    const data = await getRates();
    res.setHeader("Contetnt-Type", "application/json");
    res.send(data);
  } catch (error) {
    errorHandler(error, req, res);
  }
});
// ==================================================================== //
// ============ End Currency Route ==================================== //
// ==================================================================== //

// ===================================================================== //
// ================== Fetch Symbols Route ============================== //
// ===================================================================== //
app.get("/api/symbols", async (req, res) => {
  try {
    const data = await getSymbols();
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (error) {
    errorHandler(error, req, res);
  }
});
// ===================================================================== //
// ================== End Fetch Symbols ================================ //
// ===================================================================== //

// ===================================================================== //
// ================== Convert Currency Route =========================== //
// ===================================================================== //
app.post("/api/convert", async (req, res) => {
  try {
    const { from, to } = req.body;
    const data = await convertCurrency(from, to);
    res.setHeader("Content-type", "application/json");
    res.send(data);
  } catch (error) {
    errorHandler(error, req, res);
  }
});
/* jshint ignore:end */

// ===================================================================== //
// ================== End Convert Currency ============================= //
// ===================================================================== //

// ===================================================================== //
// ================== Get Historical Data Route ======================== //
// ===================================================================== //

// Fetch Currency Rates by date
/* jshint ignore:start */
app.post("/api/historical", async (req, res) => {
  try {
    const { date } = req.body;
    const data = await getHistoricalRate(date);
    res.setHeader("Content-type", "application/json");
    res.send(data);
  } catch (error) {
    errorHandler(error, req, res);
  }
});
/* jshint ignore:end */

// ===================================================================== //
// ================== End Historical Data Route ======================== //
// ===================================================================== //

// ============================================================================= //
// ================ ***** End of Express Routes ***** ========================== //
// ============================================================================= //
// ----------------------------------------------------------------------------- //

// ==================================================================== //
// ===========  Redirect all traffic to index.html ==================== //
// ==================================================================== //

app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// Listen for HTTP requests on port 3000
app.listen(port, () => {
  console.log("listening on %d", port);
});

/* jshint ignore:start */
/* const test = async() => {
    const data = await getHistoricalRate('2012-07-14');
    console.log(data);
} */
/* jshint ignore:end */

/* test(); */
