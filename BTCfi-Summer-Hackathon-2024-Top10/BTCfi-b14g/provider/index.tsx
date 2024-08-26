import { DashboardProvider } from '@/provider/dashboard-provider';
import { FC, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OkxWalletProvider } from './okx-wallet-provider';
import { MyStakingProvider } from '@/provider/my-staking-provider';

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <OkxWalletProvider>
      <MyStakingProvider>
        <DashboardProvider>{children}</DashboardProvider>
      </MyStakingProvider>
      <ToastContainer />
    </OkxWalletProvider>
  );
};
