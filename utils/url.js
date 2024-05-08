const isProduction = process.env.production;
const URL = isProduction ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL;
const FE_URL = isProduction ? process.env.PRODUCTION_FE_URL : process.env.DEVELOPMENT_FE_URL;

module.exports = { URL, FE_URL };
