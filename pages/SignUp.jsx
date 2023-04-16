import Layout from "./Layout";
import s from "../styles/Signin.module.css";
import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
  });
  const [blank, setBlank] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email && !form.password) {
      setBlank("noEmailAndPassword");
    } else if (!form.password) {
      setBlank("noPassword");
    } else if (!form.email) {
      setBlank("noEmail");
    } else {
      axios.post("/api/registration", form).catch((err) => console.log(err));
      setForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        age: "",
        phone: "",
      });
      setBlank("");
    }
  };
  return (
    <Layout title={"Sign Up"}>
      <div className={`text-center ${s.formSignin}`}>
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
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="floatingFirstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, firstName: e.target.value }))
              }
            />
            <label htmlFor="floatingFirstName">First Name</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="floatingLastName"
              placeholder="Password"
              value={form.lastName}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  lastName: e.target.value,
                }))
              }
            />
            <label htmlFor="floatingLastName">Last Name</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="floatingAge"
              value={form.age}
              placeholder="Age"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  age: e.target.value,
                }))
              }
            />
            <label htmlFor="floatingAge">Age</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="floatingPhone"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
            <label htmlFor="floatingPhone">Phone</label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SignUp;
