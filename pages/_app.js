import "../styles/globals.css";
import { DarkModeToggle } from "../components/dark-mode-toggle";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DarkModeToggle />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
