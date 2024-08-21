// App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Signin from "./pages/Signin";
import OrgRegister from "./pages/OrgSignup";
import UserRegister from "./pages/UserSignup";
import OrgSignin from "./pages/OrgSignin";
import UserSignin from "./pages/UserSignin";
import MarketPlace from "./pages/MarketPlace";
import ErrorPage from "./pages/ErrorPage";
import Sidebar from "./components/Sidebar";
import RightSideBar from "./components/RightSideBar";
import Messages from "./pages/Messges";
import Swapper from "./pages/Swapper";
import Home from "./pages/Home";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/signin" />;
};

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!user && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register/org" element={<OrgRegister />} />
        <Route path="/register/user" element={<UserRegister />} />
        <Route path="/signin/org" element={<OrgSignin />} />
        <Route path="/signin/user" element={<UserSignin />} />

        {/* Protected routes */}
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Sidebar />
              <div className="flex">
                <MarketPlace />
                <RightSideBar />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Sidebar />
              <div className="flex">
                <Home />
                <RightSideBar />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Sidebar />
              <div className="flex">
                <Messages />
                <RightSideBar />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/swapper"
          element={
            <ProtectedRoute>
              <Sidebar />
              <div className="flex">
                <Swapper />
                <RightSideBar />
              </div>
            </ProtectedRoute>
          }
        />
        {/* Add similar ProtectedRoute wrappers for other authenticated routes */}

        {/* Catch-all route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnonAadhaarProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </AnonAadhaarProvider>
    </BrowserRouter>
  );
}

export default App;
