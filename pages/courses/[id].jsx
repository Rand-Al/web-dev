import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { useState } from "react";
import axios from "axios";
import Layout from "../Layout";
import Image from "next/image";
import s from "../../styles/Home.module.css";

const Course = ({ coursesList, usersList, user }) => {
  const router = useRouter();
  const courseId = Number(router.query.id);
  const course = coursesList?.filter((course) => course.id === courseId)[0];
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(course?.comments);

  const userId = user.id;
  const role = user.role;
  const addComment = async () => {
    try {
      const res = await axios.post("/api/comments", {
        comment,
        userId,
        courseId,
      });
      setComment("");
      if (comments.length < 1) {
        setComments([
          {
            id: 1,
            body: comment,
            userId: userId,
            courseId: courseId,
          },
        ]);
      } else {
        setComments((prev) => [
          ...prev,
          {
            id: prev[prev.length - 1].id++,
            body: comment,
            userId: userId,
            courseId: courseId,
          },
        ]);
      }
      я;

      console.log(res);
    } catch (errors) {
      console.log(errors);
    }
  };
  const deleteComment = async (id, courseId, userId) => {
    try {
      const res = await axios.post(`/api/comments/`, {
        id,
        userId,
        courseId,
        delete: true,
      });
      console.log(res);
      setComments(comments.filter((comment) => comment.id !== id));
    } catch (errors) {
      console.log(errors);
    }
  };
  return (
    <Layout user={user} title={course?.title} courseTitle={course?.title}>
      {!coursesList ? (
        <div className={`${s.networkError}`}>
          <span>Network error. Try to reload a page.</span>
        </div>
      ) : (
        <div className="container mt-10">
          <div className="p-5 mb-4 bg-body-tertiary rounded-3 mt-4">
            <div className="container-fluid">
              <h1 className="display-5 fw-bold text-center">{course.title}</h1>
              <div className="image-ibg-course-details">
                <Image
                  src={course.image}
                  alt=""
                  className="float p-3 radius-img"
                  width="1600"
                  height="400"
                />
              </div>

              <p className="fs-4 px-3">{course.description}</p>
            </div>
          </div>
          <section className="w-100 p-4">
            {comments?.map((comment) => {
              const user = usersList.filter(
                (user) => user.id === comment.userId
              )[0];
              console.log(comment.id);
              const getFullName = (firstName, lastName) => {
                if (firstName === "" && lastName === "") {
                  return user.email;
                } else if (firstName === "") {
                  return lastName;
                } else if (lastName === "") {
                  return firstName;
                } else {
                  return `${firstName} ${lastName}`;
                }
              };
              const fullName = getFullName(user.firstName, user.lastName);
              return (
                <div
                  className="row d-flex justify-content-center text-dark"
                  key={comment.id}
                >
                  <div className="col-md-11 col-lg-9 col-xl-7">
                    <div className="d-flex flex-start mb-4 gap-3">
                      <div className="containerIbg">
                        <div className="image-ibg">
                          <Image
                            className="rounded-circle shadow-1-strong me-3"
                            src={user.ava}
                            alt="avatar"
                            width="65"
                            height="65"
                          />
                        </div>
                      </div>
                      <div className="card w-100">
                        <div className="card-body p-4">
                          <div className="">
                            <h5>{fullName}</h5>
                            {/* <p className="small">3 hours ago</p> */}
                            <p>{comment.body}</p>

                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <a href="#!" className="link-muted me-2">
                                  <i className="fas fa-thumbs-up me-1"></i>132
                                </a>
                                <a href="#!" className="link-muted">
                                  <i className="fas fa-thumbs-down me-1"></i>15
                                </a>
                              </div>
                              {(userId === comment.userId ||
                                role === "admin") && (
                                <button
                                  onClick={() =>
                                    deleteComment(comment.id, courseId, user.id)
                                  }
                                  href="#!"
                                  className="link-muted btn btn-danger"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="card-body p-4">
              <div className="d-flex flex-start w-100">
                <div className="w-100">
                  <h5>Add a comment</h5>
                  <div className="form-outline">
                    <textarea
                      className="form-control"
                      id="textAreaExample"
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <label className="form-label" htmlFor="textAreaExample">
                      What is your view?
                    </label>
                    <div className="form-notch">
                      <div className="form-notch-leading"></div>
                      <div className="form-notch-middle"></div>
                      <div className="form-notch-trailing"></div>
                    </div>
                  </div>
                  <div className="d-flex mt-3 flex-row-reverse">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => addComment()}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
};
export default Course;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  const resCourses = await axios.get(`http://127.0.0.1:3000/api/courses`);
  const coursesList = resCourses.data;
  const resUsers = await axios.get(`http://127.0.0.1:3000/api/users`);
  const usersList = resUsers.data;
  if (user === undefined) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { coursesList, usersList, user: req.session.user },
  };
},
sessionOptions);
