import React from "react";
import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  AnonAadhaarProof,
} from "@anon-aadhaar/react";

const AnonAadhar = () => {
  const [anonAadhaar] = useAnonAadhaar();

  return (
    <div className="w-full h-full flex items-center justify-center">
      {anonAadhaar?.status !== "logged-in" ? (
        <LogInWithAnonAadhaar
          fieldsToReveal={["revealAgeAbove18"]}
          nullifierSeed={12345}
        />
      ) : (
        <>
          <p>✅ Proof is valid</p>
          <AnonAadhaarProof
            code={JSON.stringify(anonAadhaar.anonAadhaarProofs, null, 2)}
          />
        </>
      )}
    </div>
  );
};

export default AnonAadhar;
