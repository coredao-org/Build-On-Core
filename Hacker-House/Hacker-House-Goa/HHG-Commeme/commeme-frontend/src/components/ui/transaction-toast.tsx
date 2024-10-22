// src/components/TransactionToast.tsx
import React from 'react';
import { IconCircleCheck } from '@tabler/icons-react';

interface TransactionToastProps {
  title: string;
  hash: string;
  scanner?: string;
}

export const TransactionToast: React.FC<TransactionToastProps> = ({
  title,
  hash,
  scanner = `https://polygonscan.com/tx/`,
}) => {
  return (
    <div className="flex items-center">
      <IconCircleCheck />
      <span className="font-medium text-sm ml-2">{title}</span>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`${scanner}${hash}`}
        className="ml-2 text-blue-400 underline"
      >
        See here
      </a>
    </div>
  );
};
