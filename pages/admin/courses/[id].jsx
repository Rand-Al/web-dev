import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/pages/Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import s from "../../../styles/Course.module.css";
import firestoreDb from "../../../data/firestore/firestore";
import f from "../../../data/firestore/service";
import { v4 as uuidv4 } from "uuid";

const CourseEdit = ({ coursesList, categoriesList, user }) => {
  const router = useRouter();
  const courseId = router.query.id;
  const [course, setCourse] = useState(
    coursesList.find((course) => course.id === courseId)
  );
  const [categories, setCategories] = useState(
    categoriesList.filter(
      (cat) => !course.categories.map((categ) => categ.id).includes(cat.id)
    )
  );
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState(course.tags.join(", "));
  const [isSuccess, setIsSuccess] = useState(false);
  const [path, setPath] = useState("");
  const [fileName, setFileName] = useState("");
  const [emptyFieldError, setEmptyFieldError] = useState("");
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
    }
    let newCourse = course;
    newCourse.tags = tags.split(", ");
    setCourse(newCourse);
    const responseCourse = await axios.put("/api/courses", {
      course,
      image: path && path,
    });
    if (responseCourse.status === 200) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/admin/courses");
      }, 2000);
    }
  };
  const goBack = () => {
    router.back();
  };
  console.log(path);
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
            <span>Edit course:</span>
            {course?.title}
            <span className="underline"></span>
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
            <div className="flex-grow-1">
              <div className={`form-floating mb-3`}>
                <input
                  type="text"
                  className={`form-control`}
                  id="floatingTitle"
                  placeholder="Title"
                  value={course?.title}
                  onChange={(e) =>
                    setCourse((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
                <label htmlFor="floatingInput">Title</label>
              </div>

              <div className="form-floating mb-3">
                <textarea
                  type="text"
                  className={`form-control textarea`}
                  id="floatingArea"
                  placeholder="Description"
                  value={course?.description}
                  onChange={(e) =>
                    setCourse((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                ></textarea>
                <label htmlFor="floatingPassword">Description</label>
              </div>
            </div>
          </div>

          <div className="form-floating d-flex mb-3 align-items-center gap-2">
            <div className="border flex-grow-1 p-2 d-flex gap-3 flex-wrap">
              {course?.categories.map((cat) => (
                <div key={cat.id} className="d-flex border">
                  <span className="px-2 fst-italic">{cat?.title}</span>
                  <button
                    onClick={(e) => deleteCategory(cat.id, course.id, e)}
                    className="btn btn-danger py-0 px-2"
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
