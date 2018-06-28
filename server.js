// server.js Express server running in node

require("dotenv").config(); // read the .env file
const express = require("express");
const { getRates, getSymbols } = require("./lib/fixer-service");
const  { convertCurrency } = require('./lib/free-currenct-service');
const app = express();
const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static("public"));

// Allow front-end access to node_modules folder
app.use("/scripts", express.static(`${__dirname}/node_modules/`));

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

// ==================================================================== //
// ================ Fetch Latest Currency Rates ======================= //
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
/* jshint ignore:end */
// ==================================================================== //
// ============== End .get fetch Express Route ======================== //
// ==================================================================== //

// ==================================================================== //
// ===========  Redirect all traffic to index.html =================== //
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// Listen for HTTP requests on port 3000
app.listen(port, () => {
  console.log("listening on %d", port);
});

/* jshint ignore:start */
/* const test = async() => {
    const data = await getRates();
    console.log(data);
} */
/* jshint ignore:end */

/* test(); */
