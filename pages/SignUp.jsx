import s from "../styles/Signup.module.css";
import { useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import Link from "next/link";
import { useRouter } from "next/router";

const Signup = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
  });
  const [lack, setLack] = useState("");
  const [uniqueEmail, setUniqueEmail] = useState();
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email && !form.password) {
      setLack("noEmailAndPassword");
    } else if (!form.password) {
      setLack("noPassword");
    } else if (form.password !== form.passwordConfirmation) {
      setLack("notEqualPasswords");
    } else if (!form.email) {
      setLack("noEmail");
    } else {
      try {
        const response = await axios.post("/api/registration", form);
        setForm({
          email: "",
          password: "",
          passwordConfirmation: "",
          firstName: "",
          lastName: "",
          age: "",
          phone: "",
        });
        setLack("");
        if (response.status === 200) {
          setIsSuccess(true);
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
      } catch (errors) {
        setUniqueEmail(errors.response.data);
      }
    }
  };
  return (
    <Layout title={"Sign Up"}>
      {isSuccess && (
        <div className={`${s.success} container`}>
          Account created successfully! You can log in after administrator
          approve your user account .
        </div>
      )}
      <div className={`text-center ${s.formSignin} mb-60 mt-4`}>
        <form className="mt-10" onSubmit={(e) => handleSubmit(e)}>
          <h1 className="h3 mb-4 fw-normal">Sign Up</h1>
          {(lack === "noEmail" ||
            lack === "noEmailAndPassword" ||
            uniqueEmail) && (
            <span className={s.errorText}>
              {uniqueEmail ? uniqueEmail : "Email is required!"}
            </span>
          )}
          <div className="form-floating mb-2">
            <input
              type="email"
              className={`form-control ${
                (lack === "noEmail" ||
                  lack === "noEmailAndPassword" ||
                  uniqueEmail) &&
                `${s.formError}`
              }`}
              value={form.email}
              placeholder="Email address"
              id="floatingInput"
              onChange={(e) =>
                setForm(
                  (prev) => ({ ...prev, email: e.target.value }),
                  setLack(""),
                  setUniqueEmail("")
                )
              }
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          {(lack === "noPassword" || lack === "noEmailAndPassword") && (
            <span className={s.errorText}>Passwords is required!</span>
          )}
          {lack === "notEqualPasswords" && (
            <span className={s.errorText}>Passwords not equal!</span>
          )}
          <div className="form-floating mb-2">
            <input
              type="password"
              className={`form-control ${
                (lack === "noPassword" ||
                  lack === "noEmailAndPassword" ||
                  lack === "notEqualPasswords") &&
                `${s.formError}`
              }`}
              value={form.password}
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) =>
                setForm(
                  (prev) => ({ ...prev, password: e.target.value }),
                  setLack(""),
                  setUniqueEmail("")
                )
              }
            />

            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="password"
              className={`form-control ${
                (lack === "noPassword" ||
                  lack === "noEmailAndPassword" ||
                  lack === "notEqualPasswords") &&
                `${s.formError}`
              }`}
              value={form.passwordConfirmation}
              id="floatingPasswordConfirmation"
              placeholder="Password confirmation"
              onChange={(e) =>
                setForm(
                  (prev) => ({ ...prev, passwordConfirmation: e.target.value }),
                  setLack(""),
                  setUniqueEmail("")
                )
              }
            />

            <label htmlFor="floatingPassword">Password confirmation</label>
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
          <div className="mb-2">
            <span>Already have an account? </span>{" "}
            <Link href={`/`}>Log in</Link>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
