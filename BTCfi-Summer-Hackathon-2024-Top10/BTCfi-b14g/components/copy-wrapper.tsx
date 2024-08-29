'use client';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const CopyWrapper = ({
  children,
  value,
  iconSize = 16,
}: {
  children: React.ReactNode;
  value: string;
  iconSize?: number;
}) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <span className="flex gap-2 items-center">
      {children}
      {copied ? (
        <Check size={iconSize} />
      ) : (
        <Copy size={iconSize} onClick={copy} className="cursor-pointer" />
      )}
    </span>
  );
};
