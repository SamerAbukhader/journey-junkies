import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";
import { Footer } from "./components/UI/Footer";
import { LoadScript } from "@react-google-maps/api";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey="pk_test_cGlja2VkLXNhd2Zpc2gtOTAuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}
        libraries={["places"]}
      >
        <App />
        <Footer />
      </LoadScript>
    </ClerkProvider>
  </React.StrictMode>
);
