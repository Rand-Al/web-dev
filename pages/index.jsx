import Card from "@/components/Card";
import firestoreDb from "../data/firestore/firestore";
import service from "../data/firestore/service";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import Layout from "./Layout";
import axios from "axios";
import s from "../styles/Home.module.css";
import loading from "../public/images/spinner.svg";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export default function Home({ user, dbCategories, dbCourses }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState(dbCategories);
  const [chosenCategory, setChosenCategory] = useState("Category");
  const fetchCourses = useCallback(async () => {
    const coursesResponse = await axios.get(`/api/courses`);
    setCourses(coursesResponse.data);
  }, []);
  const fetchCategories = useCallback(async () => {
    const categoriesResponse = await axios.get("/api/categories");
    setCategories(categoriesResponse.data);
  }, []);
  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, [fetchCourses, fetchCategories]);
  const filteredByCategory = async (category) => {
    setIsLoading(true);
    const coursesResponse = await axios.get(`/api/courses`);
    setCourses(coursesResponse.data);
    setIsLoading(false);
    if (category === "All categories") {
      setIsLoading(true);
      const coursesResponse = await axios.get(`/api/courses`);
      setCourses(coursesResponse.data);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setCourses((prev) =>
        prev.filter((course) =>
          course.categories.map((c) => c.title).includes(category)
        )
      );
      setIsLoading(false);
    }
    setChosenCategory(category);
  };
  const makeUniq = (arr) => {
    const uniqSet = new Set(arr);
    return [...uniqSet];
  };
  return (
    <Layout user={user} title={"Home"}>
      {courses.length < 1 && chosenCategory === "Category" ? (
        <div className={`${s.loading}`}>
          <Image src={loading} width="200" height={200} alt="" />
        </div>
      ) : (
        <div className="container">
          <div className="p-5 bg-body-tertiary rounded-3 my-4 ">
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
                  {categories?.map((cat) => (
                    <li
                      key={cat.id}
                      onClick={() => filteredByCategory(cat.title)}
                    >
                      <span className="dropdown-item">{cat.title}</span>
                    </li>
                  ))}
                  <li>
                    <span
                      className="dropdown-item"
                      onClick={() => filteredByCategory("All categories")}
                    >
                      All categories
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <h1 className="text-center mb-5">
              From Novice to Pro: Dynamic Web Developer Courses for Every Skill
              Level
            </h1>
            {isLoading ? (
              <div className={`${s.loadingSmall}`}>
                <Image src={loading} width="200" height={200} alt="" />
              </div>
            ) : (
              <>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  {makeUniq(
                    courses
                      ?.filter((course) =>
                        course.title
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                      .concat(
                        courses.filter((course) =>
                          course.tags
                            .join()
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                        )
                      )
                  ).map((course) => (
                    <Card key={course.id} course={course} />
                  ))}
                </div>
                {makeUniq(
                  courses
                    ?.filter((course) =>
                      course.title
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
                    .concat(
                      courses.filter((course) =>
                        course.tags
                          .join()
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                    )
                ).length < 1 && <div className={s.coursesLess}>No courses</div>}
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
  query,
}) {
  const user = req.session.user;
  const dbCourses = service.getCoursesWithCategories(firestoreDb);
  const categories = service.getCategories(firestoreDb);
  if (user === undefined) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      dbCourses: JSON.stringify(dbCourses),
      user: req.session.user,
    },
  };
},
sessionOptions);
