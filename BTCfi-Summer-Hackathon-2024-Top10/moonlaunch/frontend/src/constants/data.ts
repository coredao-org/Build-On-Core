import { BondingCurveAMMAbi } from "../abis/BondingCurveAMM";
import { tokenAbi } from "../abis/tokenAbi";

export const testnetCurveConfig = {
  abi: BondingCurveAMMAbi,
  address: "0xFcA69B9033C414cBCfa24b30228376fd040b70B2" as `0x${string}`,
};

export const mainnetCurveConfig = {
  abi: BondingCurveAMMAbi,
  address: "0xD62BfbF2050e8fEAD90e32558329D43A6efce4C8" as `0x${string}`,
};

export const tokenConfig = {
  abi: tokenAbi,
};
