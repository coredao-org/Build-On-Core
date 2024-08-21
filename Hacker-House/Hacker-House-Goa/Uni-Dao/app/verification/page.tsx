// "use client"
// import {
//   AnonAadhaarProof,
//   LogInWithAnonAadhaar,
//   useAnonAadhaar,
//   useProver,
// } from "@anon-aadhaar/react";
// import React from "react";
// import { useEffect } from "react";

// type HomeProps = {
//   setUseTestAadhaar: (state: boolean) => void;
//   useTestAadhaar: boolean;
// };

// export default function Home({ setUseTestAadhaar, useTestAadhaar }: HomeProps) {
//   // Use the Country Identity hook to get the status of the user.
//   const [anonAadhaar] = useAnonAadhaar();
//   const [, latestProof] = useProver();

//   useEffect(() => {
//     if (anonAadhaar.status === "logged-in") {
//       console.log(anonAadhaar.status);
//     }
//   }, [anonAadhaar]);

//   const switchAadhaar = () => {
//     setUseTestAadhaar(!useTestAadhaar);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 px-4 py-8">
//       <main className="flex flex-col items-center gap-8 bg-white rounded-2xl max-w-screen-sm mx-auto h-[24rem] md:h-[20rem] p-8">
//         <h1 className="font-bold text-2xl">Welcome to Anon Aadhaar Example</h1>
//         <p>Prove your Identity anonymously using your Aadhaar card.</p>

//         {/* Import the Connect Button component */}
//         <LogInWithAnonAadhaar nullifierSeed={1234} />

//         {useTestAadhaar ? (
//           <p>
//             You&apos;re using the <strong> test </strong> Aadhaar mode
//           </p>
//         ) : (
//           <p>
//             You&apos;re using the <strong> real </strong> Aadhaar mode
//           </p>
//         )}
//         <button
//           onClick={switchAadhaar}
//           type="button"
//           className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//         >
//           Switch for {useTestAadhaar ? "real" : "test"}
//         </button>
//       </main>
//       <div className="flex flex-col items-center gap-4 rounded-2xl max-w-screen-sm mx-auto p-8">
//         {/* Render the proof if generated and valid */}
//         {anonAadhaar.status === "logged-in" && (
//           <>
//             <p>✅ Proof is valid</p>
//             <p>Got your Aadhaar Identity Proof</p>
//             <>Welcome anon!</>
//             {latestProof && (
//               <AnonAadhaarProof code={JSON.stringify(latestProof, null, 2)} />
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }





import React from 'react'

export default function page() {
  return (
    <div>page</div>
  )
}

