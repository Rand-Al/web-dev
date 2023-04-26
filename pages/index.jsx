import Card from "@/components/Card";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import Layout from "./Layout";
import axios from "axios";
import s from "../styles/Home.module.css";
import { useState } from "react";
import { Rating, Typography } from "@mui/material";

export default function Home({ coursesList, user }) {
  const [courses, setCourses] = useState(coursesList);
  const [searchValue, setSearchValue] = useState("");
  const [searchParam, setSearchParam] = useState("category");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [ratingValue, setRatingValue] = useState("");

  const filterBy = (entity) => {
    console.log(
      courses.filter((course) =>
        course.category.filter((category) => category === entity)
      )
    );
  };
  console.log(user);
  return (
    <Layout user={user} title={"Home"}>
      {!courses ? (
        <div className={`${s.networkError}`}>
          <span>Network error. Try to reload a page.</span>
        </div>
      ) : (
        <div className="container">
          <div className="p-3 bg-body-tertiary rounded-3 my-4 ">
            <form className="d-flex w-100 mb-5 search">
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
            <button onClick={() => filterBy("Go")}>course</button>
            <h1 className="text-center mb-4">
              From Novice to Pro: Dynamic Web Developer Courses for Every Skill
              Level
            </h1>

            <div className="d-flex align-items-center justify-content-center flex-wrap gap-3">
              {courses
                .filter((course) =>
                  course.title.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((course) => (
                  <Card
                    key={course.id}
                    ratingValue={ratingValue}
                    setRatingValue={setRatingValue}
                    course={course}
                  />
                ))}
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
  const resCourse = await axios.get(`http://127.0.0.1:3000/api/courses`);
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
