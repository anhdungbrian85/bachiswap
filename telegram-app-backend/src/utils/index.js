const crypto = require("crypto");
require("dotenv").config();
let scoreConfig = require("./scoreConfig.json");
const validator = require("validator");
const TonWeb = require("tonweb");
const { format } = require("./datetime");

const tonweb = new TonWeb();

const getAccountAge = (id) => {
  for (let range of scoreConfig.ageConfig) {
    if (id < range.maxId) {
      return range.age;
    }
  }
};

const verifyTelegramWebAppData = async (telegramInitData) => {
  const encoded = decodeURIComponent(telegramInitData);
  const secret = crypto
    .createHmac("sha256", "WebAppData")
    .update(process.env.TELEGRAM_BOT_TOKEN);
  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  arr.sort((a, b) => a.localeCompare(b));
  const dataCheckString = arr.join("\n");
  const _hash = crypto
    .createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");
  return _hash === hash;
};

const parseTelegramInitData = (telegramInitData) => {
  const params = new URLSearchParams(telegramInitData);
  const data = {};

  // Iterate through the parameters
  for (const [key, value] of params.entries()) {
    // If the value is a JSON string, parse it
    if (value.startsWith("{") && value.endsWith("}")) {
      data[key] = JSON.parse(value);
    } else {
      // Otherwise, assign the value directly
      data[key] = validator.escape(value);
    }
  }
  return data;
};
const formatTextAmount = (value) => value?.replaceAll(",", "");
const formatNumDynDecimal = (num = 0, dec = 4) => {
  try {
    const raw = formatTextAmount(num?.toString());
    let parts = raw?.split(".");
    if (parts?.length > 1 && +parts?.[1] > 0) {
      parts[0] = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      parts[1] = roundDown(+`0.${parts[1]}`, dec).toString().split(".")[1];
      return parts?.join(".");
    } else return parts?.[0]?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch (error) {
    console.log(error);
    return num?.toString();
  }
};
const roundDown = (number, decimals = 4) => {
  decimals = decimals || 0;
  return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
const getName = (data) => {
  return data?.username || `${data?.first_name || ""} ${data?.last_name || ""}`;
};
const isAdmin = (id) => {
  const listAdminID = process.env.ADMIN_USER_ID.split(",");
  if (listAdminID.includes(id.toString())) return true;
  return false;
};
const escapeData = (data) => {
  const result = {};
  for (let key in data) {
    if (typeof data[key] == "string") {
      result[key] = validator.escape(data[key]);
    } else if (typeof data[key] == "object") {
      const subData = data[key];
      const subResult = {};
      for (let subkey in subData) {
        if (typeof subData[subkey] == "string")
          subResult[subkey] = validator.escape(subData[subkey]);
        else {
          subResult[subkey] = subData[subkey];
        }
      }
      result[key] = subResult;
    } else {
      // result[key] = result[key];
    }
  }
  return result;
};
const isValidTonWallet = (address) => {
  // Regular expression to match a TON wallet address
  const regex = /^(0:|[-1:])?[0-9a-fA-F]+$/;

  // Test the address against the regex
  // return regex.test(address);
  return !!address;
};
const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const convertToRawAddress = (address) => {
  const waddress = new TonWeb.utils.Address(address);
  return waddress.toString(false);
};
const convertRawToAddress = (address) => {
  const waddress = new TonWeb.utils.Address(address);
  return waddress.toString(true);
};
const getCheckinDate = () => {
  const today = new Date();
  const formatData = format(today, "YYYY-MM-DD");
  return new Date(formatData);
};
module.exports = {
  verifyTelegramWebAppData,
  getAccountAge,
  parseTelegramInitData,
  formatNumDynDecimal,
  roundDown,
  getName,
  isAdmin,
  escapeData,
  isValidTonWallet,
  delay,
  convertToRawAddress,
  getCheckinDate,
  convertRawToAddress,
};
