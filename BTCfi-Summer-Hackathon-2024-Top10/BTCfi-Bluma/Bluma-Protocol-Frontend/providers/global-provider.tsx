"use client";

import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import NextTopLoader from "nextjs-toploader";
import { firebaseAuth, firestore } from "@/config/firbase";
import { doc, getDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { signOut as firebaseSignOut } from "firebase/auth";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as Notifier } from "@/components/ui/toaster";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

// Create Context
const GlobalContext = React.createContext<IGlobalContextProvider | undefined>(
  undefined
);

export default function GlobalContextProvider({ children }: ILayout) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<ICredential | undefined>();

  const getRegisteredUser = useCallback(async () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          reject(new Error("No user is logged in"));
        }
      });
    });
  }, []);

  const fetchUser = async () => {
    setIsFetchingUser(true);
    try {
      const user: any = await getRegisteredUser();
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data: any = userDoc.data();
          if (data.createdAt instanceof Timestamp) {
            data.createdAt = data.createdAt.toDate().toLocaleString();
          }
          setCredentials(data);
          setIsAuthenticated(true);
        } else {
          console.error("No user data found in Firestore");
          setIsAuthenticated(false);
        }
      }
    } catch (error: any) {
      console.error("Can't fetch user:", error);
    } finally {
      setIsFetchingUser(false);
    }
  };

  useEffect(() => {

      fetchUser();

      if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
        return;
      }

      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          console.log("Permission granted");
        } else {
          console.log("Permission denied");
        }
      });

  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
      setIsAuthenticated(false);
      setCredentials(undefined);
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error("Sign out error:", error);
    }
  };

  const propsValue = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      isFetchingUser,
      credentials,
      setCredentials,
      signOut,
      fetchUser,
    }),
    [isAuthenticated, isFetchingUser, credentials]
  );

  return (
    <GlobalContext.Provider value={propsValue}>
      <Toaster richColors theme="dark" />
      <Notifier />
      <NextTopLoader showSpinner={false} color="hsl(var(--primary))" />
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = (): IGlobalContextProvider => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
