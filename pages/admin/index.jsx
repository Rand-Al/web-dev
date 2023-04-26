import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import Layout from "../Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import AdminLayout from "@/layout/AdminLayout";

const Admin = ({ user }) => {
  const router = useRouter();

  return (
    <Layout user={user} title={"Admin"}>
      <div className="container-fluid d-flex">
        <nav
          id="sidebarMenu"
          className="col-md-3 col-lg-2 d-md-block bg-body-tertiary sidebar collapse h-100vh"
        >
          <div className="position-sticky pt-3 sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link
                  className={`nav-link pl-3 ${
                    router.pathname === "/admin/users" && "active"
                  }`}
                  href="/admin/users"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-users align-text-bottom pr-3"
                    aria-hidden="true"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    router.pathname === "/admin/courses" && "active"
                  }`}
                  href="/admin/courses"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-file align-text-bottom"
                    aria-hidden="true"
                  >
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  Courses
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </Layout>
  );
};

export default Admin;
export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  if (user === undefined) {
    return {
      props: {},
    };
  }

  return {
    props: { user: req.session.user },
  };
},
sessionOptions);
