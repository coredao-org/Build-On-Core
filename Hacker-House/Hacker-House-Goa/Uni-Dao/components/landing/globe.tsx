//@ts-nocheck
import createGlobe from "cobe";
import { useEffect, useRef } from "react";


export default function App() {
  const canvasRef = useRef();

  useEffect(() => {
   
    let phi = 0
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.83, 0.69, 0.22], 
      markerColor: [1, 0.84, 0], 
      glowColor: [0.7, 0.62, 0], 
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 }
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
       
        phi += 0.003;
      }
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="App">
      
      <canvas
        ref={canvasRef}
        style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      />
    </div>
  );
}
