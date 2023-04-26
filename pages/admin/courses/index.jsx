import React from "react";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import Layout from "@/pages/Layout";
import AdminLayout from "@/layout/AdminLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";

const Courses = ({ coursesList, user }) => {
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
  return (
    <Layout user={user} title={"Courses"}>
      <AdminLayout>
        <div className="table-responsive flex-grow-1 p-3">
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

          <table className="table table-striped table-sm ">
            <thead>
              <tr>
                <th scope="col">Course Id</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col">Tag</th>
                <th scope="col">Image</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="">
              {courses
                .filter((course) =>
                  course.title.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((course) => {
                  return (
                    <tr key={course.id}>
                      <td>{course.id}</td>
                      <td>
                        <Link href={`/courses/${course.id}`}>
                          {course.title}
                        </Link>
                      </td>
                      <td>{course.description}</td>
                      <td>
                        {course.category.map((category, idx) => (
                          <div key={idx}>{category}, </div>
                        ))}
                      </td>
                      <td>
                        {course.tag.map((tag, idx) => (
                          <div key={idx}>{tag}, </div>
                        ))}
                      </td>
                      <td>
                        <div className="image-ibg-course">
                          <img src={course.image} alt="" />
                        </div>
                      </td>
                      <td className="d-flex flex-column gap-3 p-2">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="btn btn-warning "
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          href={`/admin/courses/${course.id}`}
                          className="btn btn-danger "
                        >
                          Delete
                        </button>
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
  const resCourses = await axios.get(`http://localhost:3000/api/courses`);
  const coursesList = resCourses.data;
  console.log(user);
  if (user === undefined) {
    return {
      props: {},
    };
  }

  return {
    props: { user: req.session.user, coursesList },
  };
},
sessionOptions);
