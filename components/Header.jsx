import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import s from "../styles/Header.module.css";

export default function Header({ user, title, courseTitle }) {
  const router = useRouter();
  const handleLogout = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/logout");
    if (response.status === 200) {
      router.push("/");
    }
  };
  return (
    <header className={`p-3 bg-dark text-white fw-bold ${s.header}`}>
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
              className={`collapse navbar-collapse justify-content-end`}
              id="navbarSupportedContent"
            >
              <div className="flex-auto"></div>

              <ul
                className={`navbar-nav ${
                  user &&
                  router.pathname !== "/profile" &&
                  `me-auto` &&
                  title !== courseTitle
                } mb-2 mb-lg-0 flex-grow-0`}
              >
                {user !== undefined && (
                  <>
                    {" "}
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
                          router.pathname === "/profile" && "active"
                        }`}
                        aria-current="page"
                        href={`/profile`}
                      >
                        Profile
                      </Link>
                    </li>
                    {user.role === "admin" && (
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
                    )}
                    <li className="nav-item">
                      <button
                        className={`nav-link`}
                        onClick={(e) => handleLogout(e)}
                      >
                        Log out
                      </button>
                    </li>
                  </>
                )}

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
