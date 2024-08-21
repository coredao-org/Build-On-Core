import React, { useEffect, useState } from "react";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import Home from "./Home";
import Navbar from '../components/Navbar';

const App: React.FC = () => {
	const [ready, setReady] = useState<boolean>(false);
	const [useTestAadhaar, setUseTestAadhaar] = useState<boolean>(false);

	useEffect(() => {
		setReady(true);
	}, []);

	return (
		<><AnonAadhaarProvider
		useTestAadhaar={useTestAadhaar}
		appName="Corosuke"
	>
		<Navbar />
		<div className=" bg-bgimg bg-cover bg-fixed bg-center bg-no-repeat h-full w-full">
		
			<main className="p-2 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
				<div className="py-10">
					<div className="flex justify-center mb-20">
						{ready ? (
							
								<Home setUseTestAadhaar={setUseTestAadhaar} useTestAadhaar={useTestAadhaar} />
							
						) : null}
					</div>
				</div>
			</main></div></AnonAadhaarProvider>
		</>
	);
}

export default App;
