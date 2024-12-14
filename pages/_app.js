import "../styles/globals.css";
import { useState } from "react";
import { DarkModeToggle } from "../components/dark-mode-toggle";
import { InfoButton } from "../components/info-button";
import { InfoModal } from "../components/info-modal";

function MyApp({ Component, pageProps }) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  return (
    <>
      <DarkModeToggle />
      <InfoButton onClick={() => setIsInfoModalOpen(true)} />
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
