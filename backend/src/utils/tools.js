require("dotenv").config();

module.exports.convertToUTCTime = (date) => {
  return date.toISOString().replace(/T/, " ").replace(/\..+/, "");
};

module.exports.freeFarmeSpeed = {
  bachi: 23148148150000,
  taiko: 34722222220,
};
