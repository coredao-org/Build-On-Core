"use client";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const TokenDataContext = createContext();

// Create a custom hook for easy context usage
export const useTokenData = () => useContext(TokenDataContext);

// Define the provider component
export const TokenDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenAllCotractDetails, setTokenAllCotractDetails] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        let fetchedData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          _id: doc.id,
        }));
        fetchedData = fetchedData.sort((a, b) => a.createdAt - b.createdAt);
        setData(fetchedData);
      } catch (error) {
        setError("Failed to fetch data: " + error.message);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tokenDetails"));
        const fetchedData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          _id: doc.id,
        }));
        setTokenAllCotractDetails(fetchedData);
      } catch (error) {
        console.error("Error fetching token details:", error);
        setError("Failed to fetch data: " + error.message);
      }
    };
    fetchTokenDetails();
  }, []);
  // The value that will be passed to consuming components
  const value = {
    data,
    tokenAllCotractDetails,
    setData,
  };
  return (
    <TokenDataContext.Provider value={value}>
      {children}
    </TokenDataContext.Provider>
  );
};
