import { useRouter } from "next/router";
import React, { useState } from "react";
import axios from "axios";
import Layout from "@/pages/Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import s from "../../../styles/Course.module.css";
import firestoreDb from "../../../data/firestore/firestore";
import f from "../../../data/firestore/service";
import Image from "next/image";

const AddCourse = ({ categoriesList, user }) => {
  const router = useRouter();
  const courseId = router.query.id;
  const [course, setCourse] = useState({
    title: "",
    description: "",
    categories: [],
    tags: [],
    image: "",
  });
  const [categories, setCategories] = useState(
    categoriesList.filter(
      (cat) => !course.categories.map((categ) => categ.id).includes(cat.id)
    )
  );
  const [createObjectURL, setCreateObjectURL] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState(course.tags.join(", "));
  const [isSuccess, setIsSuccess] = useState(false);
  const [path, setPath] = useState("");
  const [fileName, setFileName] = useState("");
  const [emptyFieldError, setEmptyFieldError] = useState("");
  const [textareaState, setTextareaState] = useState("");
  const addCategory = async (category, courseId) => {
    const resCategory = await axios.post("/api/courses", {
      category,
      courseId,
      toCourse: true,
    });
    const updatedCourse = course;
    updatedCourse.categories = [...course.categories, category];
    setCourse(updatedCourse);
    const filteredCategories = categoriesList.filter(
      (cat) => !course.categories.map((categ) => categ.id).includes(cat.id)
    );
    setCategories(filteredCategories);
  };
  console.log(textareaState);
  const deleteCategory = async (categoryId, courseId, e) => {
    e.preventDefault();
    const res = await axios.post("/api/courses", {
      categoryId,
      courseId,
      delCat: true,
    });
    console.log(res);
    const updatedCourse = course;
    updatedCourse.categories = [
      ...course.categories.filter((cat) => cat.id !== categoryId),
    ];
    setCourse(updatedCourse);
    const filteredCategories = categoriesList.filter(
      (cat) => !course.categories.map((categ) => categ.id).includes(cat.id)
    );
    setCategories(filteredCategories);
  };
  const uploadImageToState = async (event) => {
    if (event.target.files[0]) {
      event.preventDefault();
      const image = event.target.files[0];
      setImage(image);
      setCreateObjectURL(URL.createObjectURL(image));
      const formData = new FormData();
      formData.append("avatar", image);
      const responseUpload = await axios.post("/api/upload", formData);
      const { filePath } = await responseUpload.data;
      const url = filePath;
      let localPath = url.match(/\/[\w.-]+\.[\w]+$/)[0];
      setPath(localPath);
      let fileName = localPath.replace("/", "");
      setFileName(fileName);
    }
  };

  const handleAllChanges = async (e) => {
    e.preventDefault();
    if (course.title.length < 1 && course.description.length < 1) {
      setEmptyFieldError("noTitleAndDescription");
    } else if (course.title.length < 1) {
      setEmptyFieldError("noTitle");
    } else if (course.description.length < 1) {
      setEmptyFieldError("noDescription");
    } else {
      let newCourse = course;
      newCourse.tags = tags.split(", ");
      setCourse(newCourse);
      const responseCourse = await axios.post("/api/courses", {
        course,
        image: path && path,
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
  console.log(course.description);
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
            <span>Add course:</span>
            {course?.title}
            <span className="underline"></span>
          </h1>
          <div className="d-flex align-items-end gap-3">
            <div className="mb-3 d-flex flex-column gap-1">
              <h4 className="align-self-center mb-0">Select Image</h4>
              <div className="editCourseImage-ibg">
                <Image
                  src={
                    createObjectURL
                      ? createObjectURL
                      : "/images/tech/placeholderCourse.jpg"
                  }
                  width="300"
                  height="100"
                  alt=""
                />
              </div>
              <label
                htmlFor="avatar"
                className="btn btn-primary align-self-stretch"
              >
                {fileName ? fileName : "Chose Photo"}
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  className="absolute"
                  onChange={uploadImageToState}
                />
              </label>
            </div>
            <div className="flex-grow-1 d-flex flex-column justify-content-between">
              {(emptyFieldError === "noTitleAndDescription" ||
                emptyFieldError === "noTitle") && (
                <div className={`px-2 fs-5 mb-1 ${s.redText}`}>
                  Title is required!
                </div>
              )}
              <div className={`form-floating mb-3`}>
                <input
                  type="text"
                  className={`form-control ${
                    (emptyFieldError === "noTitleAndDescription" ||
                      emptyFieldError === "noTitle") &&
                    s.red
                  }`}
                  id="floatingTitle"
                  placeholder="Title"
                  value={course?.title}
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
                <div className={`px-2 fs-5 ${s.redText}`}>
                  Description is required!
                </div>
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
            <div className="border flex-grow-1 p-2 d-flex gap-3 flex-wrap">
              <span className="fst-italic">
                Categories could be added only after creating course in editing
                section.
              </span>
              {course?.categories.map((cat) => (
                <div key={cat.id} className="d-flex border">
                  <span className="px-2 fst-italic">{cat?.title}</span>
                  <button
                    onClick={(e) => deleteCategory(cat.id, course.id, e)}
                    className="btn btn-danger py-0 px-2 disabled"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <div>
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-primary dropdown-toggle "
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled
                >
                  Category
                </button>
                <ul className="dropdown-menu">
                  {categories?.map((cat) => (
                    <li key={cat.id}>
                      <div
                        onClick={() => addCategory(cat, course.id)}
                        className="dropdown-item"
                      >
                        {cat.title}
                      </div>
                    </li>
                  ))}
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
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <label htmlFor="floatingInput">Tags</label>
          </div>
          <button
            className="align-self-end btn btn-lg btn-primary"
            type="submit"
            onClick={(e) => handleAllChanges(e)}
          >
            Confirm changes
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddCourse;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  const categoriesList = await f.getCategories(firestoreDb);
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
      categoriesList,
      user: req.session.user,
    },
  };
},
sessionOptions);
