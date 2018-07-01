// fixer-service.js - helper module for Express

require("dotenv").config();

const axios = require("axios");
const symbols = process.env.SYMBOLS || "EUR,USD,GBP";

// AXIOS Client declaration
const api = axios.create({
  baseURL: "http://data.fixer.io/api",
  params: {
    access_key: process.env.API_KEY
  },
  timeout: process.env.TIMEOUT || 5000
});

// Generic GET request function

/* jshint ignore:start */
const get = async url => {
  const response = await api.get(url);
  // The {} around data is a destructuring assignment
  // all response object properties are assigned to data
  const { data } = response;
  if (data.success) {
    return data;
  }
  throw new Error(data.error.type);
};
/* jshint ignore:end */

module.exports = {
  getRates: () => get(`/latest&symbols=${symbols}&base=EUR`),
  getSymbols: () => get("/symbols")
};
