import React from "react";
import AdminLayout from "@/layout/AdminLayout";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";

const Courses = ({ coursesList }) => {
  const [courses, setCourses] = useState(coursesList);
  return (
    <div className="table-responsive flex-grow-1 p-3">
      <h2 className="d-flex justify-content-between">
        <span>Courses</span>
        <Link href={`/admin/courses/add`} className="btn btn-primary">
          Add Course
        </Link>
      </h2>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">Course Id</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Category</th>
            <th scope="col">Tag</th>
            <th scope="col">Image</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            return (
              <tr key={Math.random()}>
                <td>{course.id}</td>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>
                  {course.category.map((category) => (
                    <div key={course.id}>{category}</div>
                  ))}
                </td>
                <td>
                  {course.tag.map((tag) => (
                    <div key={course.id}>{tag}</div>
                  ))}
                </td>
                <td>
                  <img src={course.image} alt="" />
                </td>
                <td>
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="btn btn-warning"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;
Courses.Layout = AdminLayout;

export async function getStaticProps() {
  const res = await axios.get(`http://localhost:3000/api/courses`);
  const coursesList = res.data;
  return {
    props: {
      coursesList,
    },
  };
}
