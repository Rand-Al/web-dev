import s from "../styles/Login.module.css";
import { useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import Link from "next/link";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [blank, setBlank] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email && !form.password) {
      setBlank("noEmailAndPassword");
    } else if (!form.password) {
      setBlank("noPassword");
    } else if (!form.email) {
      setBlank("noEmail");
    } else {
      try {
        await axios.post("/api/login", JSON.stringify(form), {
          headers: { "Content-Type": "application/json" },
        });
        window.location.href = "/";
      } catch (errors) {
        if (errors.response.status === 403) {
          alert(errors.response.data);
        }
        if (errors.response.status === 401) {
          alert("Invalid credentials");
        }
      }
    }
  };
  return (
    <Layout title={"Sign In"}>
      <div className={`text-center ${s.formSignin} mb-60 mt-60`}>
        <form className="mt-10" onSubmit={(e) => handleSubmit(e)}>
          <h1 className="h3 mb-4 fw-normal">Sign in</h1>
          {(blank === "noEmail" || blank === "noEmailAndPassword") && (
            <span>Email is required!</span>
          )}
          <div className="form-floating mb-2">
            <input
              type="email"
              className={`form-control ${
                (blank === "noEmail" || blank === "noEmailAndPassword") &&
                `${s.formError}`
              }`}
              value={form.email}
              placeholder="Email address"
              id="floatingInput"
              onChange={(e) =>
                setForm(
                  (prev) => ({ ...prev, email: e.target.value }),
                  setBlank("")
                )
              }
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          {(blank === "noPassword" || blank === "noEmailAndPassword") && (
            <span>Password is required!</span>
          )}
          <div className="form-floating mb-2">
            <input
              type="password"
              className={`form-control ${
                (blank === "noPassword" || blank === "noEmailAndPassword") &&
                `${s.formError}`
              }`}
              value={form.password}
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) =>
                setForm(
                  (prev) => ({ ...prev, password: e.target.value }),
                  setBlank("")
                )
              }
            />

            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="mb-2">
            <span>Don’t you have an account?</span>{" "}
            <Link href={`/signup`}>Sign up</Link>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
