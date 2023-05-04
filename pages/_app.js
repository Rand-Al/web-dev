import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import { useEffect } from "react";
import "semantic-ui-css/semantic.min.css";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  });
  return (
    <div>
      <Component {...pageProps} className="d-flex flex-column h-100" />
    </div>
  );
}
