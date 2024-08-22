// src/pages/api/validate-address.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config"; // Adjust the import path if necessary

export default async function handler(req, res) {
  const { userAddress } = req.query;

  if (!userAddress) {
    return res.status(400).json({ error: "User address is required" });
  }
  try {
    const adminDoc = await getDoc(
      doc(db, "admin-addresses", "85u06pxpN4kQnSdvMRYb")
    );
    const adminAddresses = adminDoc.data()?.address || [];
    if (adminAddresses.includes(userAddress)) {
      return res.status(200).json({ isValid: true });
    } else {
      return res.status(401).json({ isValid: false });
    }
  } catch (error) {
    console.error("Error validating address:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
