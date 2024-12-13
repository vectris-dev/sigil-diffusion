import "../styles/globals.css";
import { DarkModeToggle } from "../components/DarkModeToggle";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DarkModeToggle />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
