import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import "../styles/globals.css";
import Layout from "./Layout";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  const AdminLayout = Component.Layout || EmptyLayout;
  return (
    <div>
      <Layout>
        <AdminLayout>
          <Component {...pageProps} className="d-flex flex-column h-100" />
        </AdminLayout>
      </Layout>
    </div>
  );
}

const EmptyLayout = ({ children }) => <>{children}</>;
