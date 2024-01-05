import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";
import { Footer } from "./components/UI/Footer";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey="pk_test_cGlja2VkLXNhd2Zpc2gtOTAuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <App />
      <Footer />
    </ClerkProvider>
  </React.StrictMode>
);
