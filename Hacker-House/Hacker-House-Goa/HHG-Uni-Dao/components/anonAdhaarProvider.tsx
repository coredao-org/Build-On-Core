"use client";

import React from 'react';
import { AnonAadhaarProvider } from '@anon-aadhaar/react';

type AnonAadhaarProviderProps = {
  children: React.ReactNode;
  useTestAadhaar?: boolean; // Optional prop to toggle test Aadhaar mode
};

const AnonAadhaarProviderComponent = ({
  children,
  useTestAadhaar = false, // Default to false if not provided
}: AnonAadhaarProviderProps) => {
  return (
    <AnonAadhaarProvider _useTestAadhaar={useTestAadhaar}>
      {children}
    </AnonAadhaarProvider>
  );
};

export default AnonAadhaarProviderComponent;
