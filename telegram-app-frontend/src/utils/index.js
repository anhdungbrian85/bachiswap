import { formatUnits } from "ethers";
export function roundUp(v, n = 4) {
  return Math.ceil(v * Math.pow(10, n)) / Math.pow(10, n);
  // return (+v)?.toFixed(n);
}

export function roundDown(number, decimals = 2) {
  decimals = decimals || 0;
  return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  // return (+number)?.toFixed(decimals);
}
export const getName = (data) => {
  return data?.username || `${data?.first_name || ""} ${data?.last_name || ""}`;
};
export const getNameHidden = (data) => {
  const name =
    data?.username || `${data?.first_name || ""} ${data?.last_name || ""}`;

  // if (!data?.username) return "***";

  const x = name.length;
  const half = Math.floor(x / 2);
  const masked =
    x % 2 === 0
      ? name.slice(0, half) + "*".repeat(half)
      : name.slice(0, half + 1) + "*".repeat(half);

  return masked;
};
export const getAgeMul = (age) => {
  return (age / 15) * 0.1;
};
export const formatTextAmount = (value) => value?.replaceAll(",", "");
export const formatNumDynDecimal = (num = 0, dec = 4) => {
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

export const fillNumberStr = (num, fill = 2) => {
  const str = num.toString();
  return str?.length < fill ? `${"0" * (fill - str?.length)}${str}` : str;
};

export const isAdmin = (id) => {
  const listAdminID = process.env.REACT_APP_ADMIN_LIST?.split(",");
  if (listAdminID?.includes(id.toString())) return true;
  return false;
};

export const formatToK = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k";
  }
  return num.toString();
};
export const addressShortener = (addr = "", digits = 5) => {
  digits = 2 * digits >= addr.length ? addr.length : digits;
  return `${addr.substring(0, digits)}...${addr.slice(-digits)}`;
};
export const formatTokenAmount = (value, decimal = 9) => {
  try {
    return formatUnits(
      value?.toString()?.replace(/\./g, "")?.replace(/,/g, ""),
      Number(decimal)
    );
  } catch (error) {
    console.log(error);
    return;
  }
};

export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const truncateStr = (str, n = 6) => {
  if (!str) return "";
  return str.length > n
    ? str.substr(0, n - 1) + "..." + str.substr(str.length - n, str.length - 1)
    : str;
};

export const formatBalacne = (value) => {
  let num = parseFloat(value);
  num = num.toFixed(3);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const convertAndDivide = (data, chainDecimal) => {
  // If data is falsy, return 0
  if (!data) return 0;

  // Check if the data is a bigint
  if (typeof data === "bigint") {
    // const divisor = BigInt(10) ** BigInt(chainDecimal);
    // Perform division using bigint and convert to number if it's safe
    // const result = data / divisor;
    // return result <= Number.MAX_SAFE_INTEGER ? Number(result) : result.toString();
  }

  // If data is a number, perform division as usual
  return data / 10 ** chainDecimal;
};

export const formatTokenBalance = (result, number = 4) => {
  // Convert result to a number if possible, otherwise parse it as a float for large values
  const value = typeof result === "string" ? parseFloat(result) : result;

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: number,
  });

  let formatted = formatter.format(value);
  return formatted;
};

export const isReferralCode = (code) => {
  const regex = /^BachiSwap_\d+_\d+$/;
  return regex.test(code);
};

export const isDiscountCode = (code) => {
  const regex = /^BachiSwapCP_\d+_\d+$/;
  return regex.test(code);
};

export const formatBachiCode = (code) => {
  const codeArr = code.split("_");
  return Number(codeArr[1]);
};

export const isDefaultAddress = (address) => {
  const address0 = "0x0000000000000000000000000000000000000000";
  return address == address0;
};
