import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";

export default function Header({ user }) {
  const router = useRouter();
  console.log(user);
  const handleLogout = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/logout");
    if (response.status === 200) {
      window.location.href = "/";
    }
  };
  return (
    <header className="p-3 bg-dark text-white fw-bold">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light radius bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" href={`/`}>
              WebDev
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <div className="flex-auto">
                <form className="d-flex">
                  <input
                    className="form-control me-2 width-auto"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button className="btn btn-primary s" type="submit">
                    Search
                  </button>
                </form>
              </div>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      router.pathname === "/" && "active"
                    }`}
                    aria-current="page"
                    href={`/`}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      router.pathname === "/" && "profile"
                    }`}
                    aria-current="page"
                    href={`/profile`}
                  >
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      router.pathname === "/admin" ||
                      router.pathname === "/admin/users" ||
                      router.pathname === "/admin/courses"
                        ? "active"
                        : ""
                    }`}
                    href={`/admin/users`}
                  >
                    Admin
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link`}
                    onClick={(e) => handleLogout(e)}
                  >
                    Logout
                  </button>
                </li>
                {!user && (
                  <>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          router.pathname === "/" && "signin"
                        }`}
                        href={`/login`}
                      >
                        Sign In
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          router.pathname === "/" && "signup"
                        }`}
                        href={`/signup`}
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  if (user === undefined) {
    return {};
  }

  return {
    props: { user: req.session.user },
  };
},
sessionOptions);
