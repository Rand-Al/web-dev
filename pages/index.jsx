import Card from "@/components/Card";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import Layout from "./Layout";
import axios from "axios";
import s from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home({ coursesList, user }) {
  const [courses, setCourses] = useState(coursesList);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState("");
  const [chosenCategory, setChosenCategory] = useState("Category");
  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }, []);
  const filteredByCategory = (category) => {
    setCourses(coursesList);
    if (category === "All categories") {
      setCourses(coursesList);
    } else {
      setCourses((prev) =>
        prev.filter((course) => course.category.includes(category))
      );
    }
    setChosenCategory(category);
  };
  return (
    <Layout user={user} title={"Home"}>
      {!coursesList ? (
        <div className={`${s.networkError}`}>
          <span>Network error. Try to reload a page.</span>
        </div>
      ) : (
        <div className="container">
          <div className="p-3 bg-body-tertiary rounded-3 my-4 ">
            <form className="d-flex w-100 mb-3 search">
              <input
                className="form-control me-2 w-100 search-input"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <div className="search-img">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="25px"
                  height="25px"
                >
                  <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
                </svg>
              </div>
            </form>
            <div className="d-flex filter gap-2 mb-4 align-items-center">
              <p className="mb-0 fw-bold fs-5">Filter by:</p>
              <div className="btn-group ">
                <button
                  type="button"
                  className="btn btn-primary dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {chosenCategory}
                </button>
                <ul className="dropdown-menu w-0">
                  {categories &&
                    categories.map((cat, idx) => (
                      <li key={idx} onClick={() => filteredByCategory(cat)}>
                        <span className="dropdown-item">{cat}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <h1 className="text-center mb-4">
              From Novice to Pro: Dynamic Web Developer Courses for Every Skill
              Level
            </h1>

            <div className="d-flex align-items-center justify-content-center flex-wrap gap-3">
              {courses.length > 0 ? (
                courses
                  .filter((course) =>
                    course.title
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                  .map((course) => <Card key={course.id} course={course} />)
              ) : (
                <div className={`${s.coursesLess} d-flex`}>No courses</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* <Typography component="legend">Read only</Typography>
      <Rating name="read-only" value={value} readOnly />
      <Typography component="legend">Disabled</Typography>
      <Rating name="disabled" value={value} disabled />
      <Typography component="legend">No rating given</Typography>
      <Rating name="no-value" value={null} /> */}
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  const resCourse = await axios.get(`${process.env.API_URL}/api/courses`);
  const coursesList = resCourse.data;
  if (user === undefined) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { coursesList, user: req.session.user },
  };
},
sessionOptions);
