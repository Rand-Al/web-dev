import { useRouter } from "next/router";
import React, { useState } from "react";
import axios from "axios";
import Layout from "@/pages/Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import s from "../../../styles/Course.module.css";
import firestoreDb from "../../../data/firestore/firestore";
import f from "../../../data/firestore/service";
import { v4 as uuidv4 } from "uuid";

const CourseEdit = ({ coursesList, categoriesList, user }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [emptyFieldError, setEmptyFieldError] = useState("");
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [image, setImage] = useState(null);
  const router = useRouter();
  let path = "";
  const courseId = router.query.id;

  const [course, setCourse] = useState(
    coursesList.filter((course) => courseId === course.id)
  );
  console.log(course);
  // const filteredCategories = categoriesList.filter((category) => {
  //   return !course.categories.includes(category);
  // });
  // const [categories, setCategories] = useState(filteredCategories);
  const addCategories = (category, title) => {
    const newCourse = JSON.parse(JSON.stringify(course));
    newCourse.categories.push({ id: uuidv4(), title });
    setCourse(newCourse);
    const filteredCategories = categoriesList.filter((category) => {
      return !newCourse.categories.includes(category);
    });
    setCategories(filteredCategories);
  };
  const removeCategory = (title, e) => {
    e.preventDefault();
    const newCourse = JSON.parse(JSON.stringify(course));
    const categoryIndex = newCourse.categories.indexOf(title);
    console.log(categoryIndex);
    if (categoryIndex !== -1) {
      newCourse.categories.splice(categoryIndex, 1);
    }
    const filteredCategories = categoriesList.filter((category) => {
      return !newCourse.categories.includes(category);
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
  const uploadImageToState = async (event) => {
    if (event.target.files[0]) {
      event.preventDefault();
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const handleAllChanges = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", image);
    const responseUpload = await axios.post("/api/upload", formData);
    const { filePath } = await responseUpload.data;
    const url = filePath;
    const localPath = url.match(/\/[\w.-]+\.[\w]+$/)[0];
    path = localPath;
    if (course.title.length < 1 && course.description.length < 1) {
      setEmptyFieldError("noTitleAndDescription");
    } else if (course.title.length < 1) {
      setEmptyFieldError("noTitle");
    } else if (course.description.length < 1) {
      setEmptyFieldError("noDescription");
    } else {
      const responseCourse = await axios.put("/api/courses", {
        course,
        image: path,
      });
      if (responseCourse.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin/courses");
        }, 2000);
      }
    }
  };
  const handleChanges = async (e) => {
    e.preventDefault();
    if (course.title.length < 1 && course.description.length < 1) {
      setEmptyFieldError("noTitleAndDescription");
    } else if (course.title.length < 1) {
      setEmptyFieldError("noTitle");
    } else if (course.description.length < 1) {
      setEmptyFieldError("noDescription");
    } else {
      const responseCourse = await axios.put("/api/courses", {
        course,
      });
      if (responseCourse.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin/courses");
        }, 2000);
      }
    }
  };
  const goBack = () => {
    router.back();
  };
  return (
    <Layout user={user}>
      <div className="container">
        {isSuccess && (
          <div className={`${s.success} container`}>
            Course successfully edit!
          </div>
        )}
        <button
          onClick={() => goBack()}
          className="btn btn-primary mt-3 align-self-start"
        >
          &#8592; Back
        </button>
        <form className="d-flex flex-column mb-60">
          <h1 className="h3 mb-3 fw-normal text-center mt-4 fw-bold">
            <span>Edit course:</span>{" "}
            <span className="underline">{course.title}</span>
          </h1>
          <div className="d-flex align-items-center gap-2">
            <div className="mb-3 d-flex flex-column gap-1 ">
              <h4>Select Image</h4>
              <img
                src={createObjectURL ? createObjectURL : course.image}
                width="300"
                height="auto"
                alt=""
              />
              <label
                htmlFor="avatar"
                className="btn btn-primary align-self-start"
              >
                {path ? path : "Chose Photo"}
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={uploadImageToState}
                  className="absolute"
                />
              </label>
            </div>
            <div className="flex-grow-1">
              {(emptyFieldError === "noTitleAndDescription" ||
                emptyFieldError === "noTitle") && (
                <div className="px-2 fs-5">Title is required!</div>
              )}
              <div className={`form-floating mb-3 `}>
                <input
                  type="text"
                  className={`form-control ${
                    (emptyFieldError === "noTitleAndDescription" ||
                      emptyFieldError === "noTitle") &&
                    s.red
                  }`}
                  id="floatingTitle"
                  placeholder="Title"
                  value={course.title}
                  onChange={(e) =>
                    setCourse(
                      (prev) => ({ ...prev, title: e.target.value }),
                      setEmptyFieldError("")
                    )
                  }
                />
                <label htmlFor="floatingInput">Title</label>
              </div>
              {(emptyFieldError === "noTitleAndDescription" ||
                emptyFieldError === "noDescription") && (
                <div className="px-2 fs-5">Description is required!</div>
              )}
              <div className="form-floating mb-3">
                <textarea
                  type="text"
                  className={`form-control textarea ${
                    (emptyFieldError === "noTitleAndDescription" ||
                      emptyFieldError === "noDescription") &&
                    s.red
                  }`}
                  id="floatingArea"
                  placeholder="Description"
                  value={course.description}
                  onChange={(e) =>
                    setCourse(
                      (prev) => ({
                        ...prev,
                        description: e.target.value,
                      }),
                      setEmptyFieldError("")
                    )
                  }
                ></textarea>
                <label htmlFor="floatingPassword">Description</label>
              </div>
            </div>
          </div>

          <div className="form-floating d-flex mb-3 align-items-center gap-2">
            <div className="border flex-grow-1 p-3 d-flex gap-3 flex-wrap">
              {course.categories.map((category) => {
                return (
                  <div className="d-flex border" key={category.id}>
                    <span className="px-2 fst-italic">{category.title}</span>
                    <button
                      onClick={(e) => removeCategory(category.title, e)}
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
                      <li key={category.id}>
                        <div
                          onClick={(e) =>
                            addCategories(category, e.target.innerHTML)
                          }
                          className="dropdown-item"
                          href="#"
                        >
                          {category.title}
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
          {createObjectURL ? (
            <button
              onClick={(e) => handleAllChanges(e)}
              className="align-self-end btn btn-lg btn-primary"
              type="submit"
            >
              Confirm changes
            </button>
          ) : (
            <button
              onClick={(e) => handleChanges(e)}
              className="align-self-end btn btn-lg btn-primary"
              type="submit"
            >
              Confirm changes
            </button>
          )}
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
  const resCourses = await f.getCoursesWithCategories(firestoreDb);
  const resCategories = await f.getCategories(firestoreDb);
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
      coursesList: resCourses,
      categoriesList: resCategories,
      user: req.session.user,
    },
  };
},
sessionOptions);