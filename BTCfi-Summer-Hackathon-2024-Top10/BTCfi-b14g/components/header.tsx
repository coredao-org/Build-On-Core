'use client';
import { CopyWrapper } from '@/components/copy-wrapper';
import { House } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { useOkxWalletContext } from '@/provider/okx-wallet-provider';
import { shortenString } from '@/utils/string';
import Link from 'next/link';
import { useEffect } from 'react';

export const Header = () => {
  const { connect, address } = useOkxWalletContext();
  useEffect(() => {
    connect();
  }, []);
  return (
    <>
      <div className="w-full mt-4 container flex justify-between items-center">
        <Link href="/">
          <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="47" height="47" rx="8" fill="#1669BB" />
            <rect x="0.5" y="0.5" width="46" height="46" rx="7.5" stroke="white" strokeOpacity="0.1" />
            <path
              d="M11.275 31.25C9.85 31.25 7.75 30.975 6.7 30.6V13.05H8.825V19.275H8.95C9.9 18.7 11.025 18.275 12.675 18.275C15 18.275 17.5 19.7 17.5 24.325V24.7C17.5 28.825 15.375 31.25 11.275 31.25ZM11.425 29.45C13.45 29.45 15.325 28.5 15.325 25.025V24.475C15.325 21.2 14.175 20.1 11.675 20.1C10.525 20.1 9.4 20.55 8.825 20.8V29.05C9.35 29.25 10.175 29.45 11.425 29.45ZM18.976 31.05V16.35L15.926 17.025V15.75L19.976 13.875H21.176V31.05H18.976ZM28.8057 31.325V27.7H20.7557V26.175L29.2057 13.875H30.8807V25.95H33.6807V27.7H30.8807V31.325H28.8057ZM23.0557 25.95H28.8307V17.55L23.0557 25.95ZM36.5193 34.625C32.7443 34.625 30.8943 33.775 30.8943 31.925C30.8943 30.6 31.9443 29.8 33.2193 29.425V29.3C32.4943 29.025 31.9693 28.65 31.9693 27.8C31.9693 27.025 32.3943 26.275 33.3943 25.55C32.4443 24.95 31.8443 23.95 31.8443 22.55V22.3C31.8443 19.75 33.8193 18.275 36.5693 18.275C37.2193 18.275 37.8193 18.35 38.3943 18.5H42.6193V20.1H40.4943C41.0193 20.65 41.2693 21.35 41.2693 22.2V22.45C41.2693 25.1 39.1943 26.35 36.5443 26.35C35.7943 26.35 35.1193 26.25 34.4943 26.05C34.1693 26.3 33.9693 26.625 33.9693 27C33.9693 27.625 34.3443 27.8 35.1443 27.8H38.5443C40.8193 27.8 42.4943 28.55 42.4943 30.95C42.4943 33.175 40.7693 34.625 36.5193 34.625ZM36.4693 32.95C39.2693 32.95 40.2693 32.525 40.2693 31.275C40.2693 30.275 39.7443 29.8 38.1443 29.8H34.6443C33.7943 30.1 33.1443 30.625 33.1443 31.625C33.1443 32.75 34.1443 32.95 36.4693 32.95ZM36.5443 24.75C38.1943 24.75 39.1693 24.05 39.1693 22.55V22.175C39.1693 20.6 38.1193 19.875 36.5443 19.875C34.9193 19.875 33.9693 20.725 33.9693 22.125V22.5C33.9693 24.05 34.9693 24.75 36.5443 24.75Z"
              fill="white"
            />
          </svg>
        </Link>
        <HoverCard openDelay={200}>
          {address ? (
            <HoverCardTrigger asChild>
              <Button variant={'default'} className="text-base">
                {shortenString(address)}
              </Button>
            </HoverCardTrigger>
          ) : (
            <Button variant={'default'} onClick={connect} className="text-base">
              Connect wallet
            </Button>
          )}
          <HoverCardContent className="w-44 space-y-4 text-sm">
            <div>
              <CopyWrapper value={address}>
                {shortenString(address)}
              </CopyWrapper>
            </div>
            <Separator />
            <div>
              <Link href="/my-restaking">My restaking</Link>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <Separator className="mt-2" />
    </>
  );
};
