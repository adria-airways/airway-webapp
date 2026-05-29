import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css"
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const appLocalization = {
  signIn: {
    start: {
      title: 'Welcome to AirWays'
    },
  },

  signUp: {
    start: {
      title: 'Create an AirWays Account'

    }
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      localization={appLocalization}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
);
