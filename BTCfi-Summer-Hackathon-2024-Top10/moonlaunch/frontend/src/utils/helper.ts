import { mainnetCurveConfig, testnetCurveConfig } from "../constants/data";

/**
 * Truncates string (in the middle) via given lenght value
 */
export function truncate(value?: string, length = 13) {
  if (!value) {
    return value;
  }
  if (value?.length <= length) {
    return value;
  }

  const separator = "...";
  const stringLength = length - separator.length;
  const frontLength = Math.ceil(stringLength / 2);
  const backLength = Math.floor(stringLength / 2);

  return (
    value.substring(0, frontLength) +
    separator +
    value.substring(value.length - backLength)
  );
}

/**
 * Extracts Ethereum address from a string
 */
export function extractEthAddress(inputString: string) {
  const ethAddressRegex = /0x[a-fA-F0-9]{40}/;
  const match = inputString.match(ethAddressRegex);
  return match ? match[0] : "";
}

export function numberWithCommas(input: string) {
  return input.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatDate(timestamp: string) {
  const date: Date = new Date(parseInt(timestamp) * 1000);
  const formattedDate: string = date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return formattedDate;
}

export function formatTime(timestamp: string) {
  const date: Date = new Date(parseInt(timestamp) * 1000);

  const formattedTime: string = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return formattedTime;
}

export function getCurveConfig(chain?: number) {
  if (!chain || chain == 1115) return testnetCurveConfig;
  return mainnetCurveConfig;
}
