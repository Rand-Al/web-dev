import { useRouter } from "next/router";
import React, { useState } from "react";
import axios from "axios";
import Layout from "@/pages/Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";

const CourseEdit = ({ coursesList, categoriesList, user }) => {
  const router = useRouter();
  const courseId = Number(router.query.id);
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
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
  const uploadImageToState = (event) => {
    if (event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
      console.log(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append("file", image);
    const response = await axios.post("/api/upload", body);
    console.log(response);
  };
  const handleChanges = () => {
    axios.put("/api/courses", course).then((res) => console.log(res));
  };
  console.log(course);
  return (
    <Layout user={user}>
      <div className="container">
        <form>
          <h1 className="h3 mb-3 fw-normal text-center mt-4 fw-bold">
            <span>Edit course:</span>{" "}
            <span className="underline">{course.title}</span>
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
          <div>
            <img src={createObjectURL} />
            <h4>Select Image</h4>
            <input type="file" name="myImage" onChange={uploadImageToState} />
            <button
              className="btn btn-primary"
              type="submit"
              onClick={(e) => uploadToServer(e)}
            >
              Send to server
            </button>
          </div>
          <button
            onClick={() => handleChanges()}
            className="w-100 btn btn-lg btn-primary"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CourseEdit;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  const resCourses = await axios.get(`http://localhost:3000/api/courses`);
  const coursesList = resCourses.data;
  const resCategories = await axios.get(`http://localhost:3000/api/categories`);
  const categoriesList = resCategories.data;
  if (user === undefined) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { coursesList, categoriesList, user: req.session.user },
  };
},
sessionOptions);
