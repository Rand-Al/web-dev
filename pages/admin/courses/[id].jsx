import { useRouter } from "next/router";
import React, { useState } from "react";
import axios from "axios";

const CourseEdit = ({ coursesList, categoriesList }) => {
  const router = useRouter();
  const courseId = Number(router.query.id);
  const oneCourse = coursesList.filter((course) => courseId === course.id);
  const [course, setCourse] = useState(oneCourse[0]);
  const [tagValue, setTagValue] = useState(course.tag.join(", "));
  const filteredCategories = categoriesList.filter((category) => {
    return !course.category.includes(category);
  });
  const [categories, setCategories] = useState(filteredCategories);
  const addCategories = (title) => {
    const newCourse = JSON.parse(JSON.stringify(course));
    newCourse.category.push(title);
    setCourse(newCourse);
    const filteredCategories = categoriesList.filter((category) => {
      return !newCourse.category.includes(category);
    });
    setCategories(filteredCategories);
  };
  const removeCategory = (title, e) => {
    e.preventDefault();
    const newCourse = JSON.parse(JSON.stringify(course));
    const categoryIndex = newCourse.category.indexOf(title);
    if (categoryIndex !== -1) {
      newCourse.category.splice(categoryIndex, 1);
    }
    const filteredCategories = categoriesList.filter((category) => {
      return !newCourse.category.includes(category);
    });
    setCategories(filteredCategories);
    setCourse(newCourse);
  };
  const handleTag = (value) => {
    setTagValue(value);
    const tags = value.split(", ");
    let newCourse = JSON.parse(JSON.stringify(course));
    newCourse.tag = tags;
    setCourse(newCourse);
  };
  console.log(course.tag);
  return (
    <div className="container">
      <form>
        <h1 className="h3 mb-3 fw-normal">
          <span>Edit course:</span> <span>{course.title}</span>
        </h1>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingTitle"
            placeholder="Title"
            value={course.title}
            onChange={(e) =>
              setCourse((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <label htmlFor="floatingInput">Title</label>
        </div>
        <div className="form-floating mb-3">
          <textarea
            type="text"
            className="form-control textarea"
            id="floatingArea"
            placeholder="Description"
            value={course.description}
            onChange={(e) =>
              setCourse((prev) => ({ ...prev, description: e.target.value }))
            }
          ></textarea>
          <label htmlFor="floatingPassword">Description</label>
        </div>
        <div className="form-floating d-flex mb-3 align-items-center gap-2">
          <div className="border flex-grow-1 p-3 d-flex gap-3 flex-wrap">
            {course.category.map((category) => {
              return (
                <div className="d-flex border" key={category}>
                  <span className="px-2 fst-italic">{category}</span>
                  <button
                    onClick={(e) => removeCategory(category, e)}
                    className="btn btn-danger py-0 px-2"
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>
          <div>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-primary dropdown-toggle "
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Category
              </button>
              <ul className="dropdown-menu">
                {categories.map((category) => {
                  return (
                    <li key={category}>
                      <div
                        onClick={(e) => addCategories(e.target.innerHTML)}
                        className="dropdown-item"
                        href="#"
                      >
                        {category}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingTags"
            placeholder="Tags"
            value={tagValue}
            onChange={(e) => handleTag(e.target.value)}
          />
          <label htmlFor="floatingInput">Tags</label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default CourseEdit;
export async function getServerSideProps() {
  const resCourses = await axios.get(`http://localhost:3000/api/courses`);
  const coursesList = resCourses.data;
  const resCategories = await axios.get(`http://localhost:3000/api/categories`);
  const categoriesList = resCategories.data;
  return {
    props: {
      coursesList,
      categoriesList,
    },
  };
}
