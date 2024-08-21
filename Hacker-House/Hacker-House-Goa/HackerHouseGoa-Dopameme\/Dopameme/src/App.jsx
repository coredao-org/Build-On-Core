import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "./Context/ContextProvider";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import GenMemes from "./pages/GenMemes";
import MemeInputs from "./pages/MemeInputs";
import RegisterModal from "./components/RegisterModal";
import ImgOutput from "./pages/ImgOutput";
import VideoOutput from "./pages/VideoOutput";
// import { AnonAadhaarProof } from "@anon-aadhaar/react";
import AnonAadhar from "./components/AnonAadhar";
import BuyCoin from "./components/BuyCoin";
import Game from "./pages/Game";

function App() {
  return (
    <>
      <BrowserRouter>
        <div>

          <Provider>
            <Routes>
              <Route path="/" element={<Dashboard /*state = {state}*/ />} />
              <Route
                path="/r"
                element={<BuyCoin /*state = {state}*/ />}
              />
              <Route path="/home" element={<Dashboard /*state = {state}*/ />} />
              <Route
                path="/output"
                element={<ImgOutput /*state = {state}*/ />}
              />
              <Route
                path="/vid-output"
                element={<VideoOutput /*state = {state}*/ />}
              />
              <Route
                path="/explore"
                element={<Explore /*state = {state}*/ />}
              />
              <Route
                path="/meme-input"
                element={<MemeInputs /*state = {state}*/ />}
              />
              <Route
                path="/gen-memes"
                element={<GenMemes /*state = {state}*/ />}
              />
              <Route path="/games" element={<Game /*state = {state}*/ />} />
              <Route
                path="/profile"
                element={<Profile /*state = {state}*/ />}
              />
            </Routes>
            {/* {<RegisterPage/>}  */}
          </Provider>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
