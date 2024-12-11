require("dotenv").config();

module.exports.convertToUTCTime = (date) => {
  return date.toISOString().replace(/T/, " ").replace(/\..+/, "");
};

module.exports.generateReferralCode = (id) => {
  const time = Math.floor(new Date().getTime() / 1000);
  return "BachiSwap_" + id + "_" + time;
};

module.exports.getCurrentTimeInSeconds = () => {
  const currentTime = new Date();
  const seconds = Math.round(currentTime.getTime() / 1000);
  return seconds;
};
