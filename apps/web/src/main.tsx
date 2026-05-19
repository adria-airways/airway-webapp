import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

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
      <App />
    </ClerkProvider>
  </StrictMode>,
);
