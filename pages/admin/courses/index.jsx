import React from "react";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import Layout from "@/pages/Layout";
import AdminLayout from "@/layout/AdminLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { useRouter } from "next/router";
import s from "../../../styles/Table.module.css";
import firestoreDb from "../../../data/firestore/firestore";
import f from "../../../data/firestore/service";
import Image from "next/image";

const Courses = ({ coursesList, user }) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [courses, setCourses] = useState(coursesList);
  const deleteCourse = async (courseId) => {
    const response = await axios.post("/api/courses", {
      courseId: courseId,
      delete: true,
    });
    if (response.status === 200) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    }
  };
  const goBack = () => {
    router.back();
  };
  return (
    <Layout user={user} title={"Courses"}>
      <AdminLayout>
        <div className="table-responsive flex-grow-1 p-3">
          <button onClick={() => goBack()} className="btn btn-primary mb-2">
            &#8592; Back
          </button>
          <div className="d-flex align-items-center gap-3">
            <h2 className="d-flex align-items-center flex-grow-1 gap-3">
              <span className="p-0 align-self-start">Courses</span>
              <form className="w-100 search">
                <input
                  className="form-control me-2 w-100 search-input"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="25px"
                  height="25px"
                  className="search-img"
                >
                  <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
                </svg>
              </form>
            </h2>
            <span className="d-flex gap-3 align-self-start">
              <Link
                className="btn btn-primary"
                href={`/admin/courses/categories`}
              >
                Edit Categories
              </Link>
              <Link href={`/admin/courses/add`} className="btn btn-primary">
                Add Course
              </Link>
            </span>
          </div>
          <table className={`${s.respTab}`}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Tag</th>
                <th>Image</th>
                <th>Act.</th>
              </tr>
            </thead>
            <tbody>
              {courses
                .filter((course) =>
                  course.title.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((course) => {
                  return (
                    <tr key={course.id}>
                      <td>
                        <Link href={`/courses/${course.id}`}>
                          {course.title}
                        </Link>
                      </td>
                      <td>
                        <div className={s.height}>{course.description}</div>
                      </td>
                      <td>
                        {!course.categories.length && (
                          <i>No assigned category.</i>
                        )}
                        {course.categories.map((category) => {
                          return (
                            <div key={category.id}>{category.title + ", "}</div>
                          );
                        })}
                      </td>
                      <td>
                        {course.tags.map((tag, idx) => (
                          <div key={idx}>{tag}, </div>
                        ))}
                      </td>
                      <td>
                        <div className="image-ibg-course">
                          <Image
                            src={course.image}
                            alt=""
                            width="150"
                            height="100"
                          />
                        </div>
                      </td>
                      <td>
                        <div className={s.actions}>
                          <Link
                            href={`/admin/courses/${course.id}`}
                            className={s.pic}
                          >
                            <Image
                              src="/images/tech/edit.svg"
                              alt=""
                              width="30"
                              height="30"
                            />
                          </Link>
                          <div
                            onClick={() => deleteCourse(course.id)}
                            href={`/admin/courses/${course.id}`}
                            className={s.pic}
                          >
                            <Image
                              src="/images/tech/delete.svg"
                              alt=""
                              width="30"
                              height="30"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </Layout>
  );
};

export default Courses;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  const resCourses = await f.getCoursesWithCategories(firestoreDb);

  if (user === undefined) {
    return {
      props: {},
    };
  }

  return {
    props: { user: req.session.user, coursesList: resCourses },
  };
},
sessionOptions);
