import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";

export const coreTestnet = {
  id: 1115,
  name: 'Core Blockchain Testnet',
  iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_core.jpg',
  iconBackground: '#fff',
  nativeCurrency: { name: 'TCORE', symbol: 'tCORE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.test.btcs.network'] },
  },
}

export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [coreTestnet],
  ssr: true,
});

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const navItems = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Contact",
    link: "/contact",
  },
];

export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export const PoolDeatils = [
  { id: '1', token: 'lstBTC', liquidity: '$69.05M', yield: '7%', balance: '0.00', img: 'https://icons.llamao.fi/icons/chains/rsz_core.jpg' },
  { id: '2', token: 'stCORE', liquidity: '$42.08M', yield: '7%', balance: '0.00', img: 'https://icons.llamao.fi/icons/chains/rsz_core.jpg' },
]