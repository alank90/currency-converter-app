// free-currency-service.js - helper module for Express

require("dotenv").config();
const axios = require("axios");

const api = axios.create({
  baseURL: "https://free.currencyconverterapi.com/api/v5",
  timeout: process.env.TIMEOUT || 5000
});

module.exports = {
  /* jshint ignore:start */
  convertCurrency: async (from, to) => {
    const response = await api.get("/convert?q=${from}_${to}&compact-y");
    console.log(response);
    const key = Object.keys(response.data)[0];
    const { val } = response.data[key];
    return { rate: val };
  },
  /* jshint ignore:end */
};
