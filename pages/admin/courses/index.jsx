import React from "react";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import Layout from "@/pages/Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import AdminLayout from "@/layout/AdminLayout";

const Courses = ({ coursesList, user }) => {
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
          <h2 className="d-flex justify-content-between">
            <span>Courses</span>
            <Link href={`/admin/courses/add`} className="btn btn-primary">
              Add Course
            </Link>
          </h2>
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
              {courses.map((course) => {
                return (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.title}</td>
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
