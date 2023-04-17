import React from "react";
import AdminLayout from "@/layout/AdminLayout";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";

const Courses = ({ coursesList }) => {
  const [courses, setCourses] = useState(coursesList);
  console.log(courses);
  const changeStatus = (id) => {
    axios.put("/api/courses", [{ id: id }]).then((res) => console.log(res));
    setCourses((prev) => {
      const user = prev.find((user) => user.id === id);
      user.isApproved = true;
      return [...prev];
    });
  };
  const deleteUser = (id) => {
    axios
      .delete(`/api/users/${id}`, { data: id })
      .then((res) => console.log(res));
    setCourses((prev) => prev.filter((user) => user.id !== id));
  };
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
              <tr key={course.id}>
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
  console.log(res.data);
  return {
    props: {
      coursesList,
    },
  };
}
