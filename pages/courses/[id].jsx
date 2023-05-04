import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Layout from "../Layout";
import Image from "next/image";
import s from "../../styles/Home.module.css";
import { Rating } from "@mui/material";
import { Button, Comment, Form, Header } from "semantic-ui-react";

const Course = ({ user }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const courseId = router.query.id;
  const [comment, setComment] = useState();
  const [isBlank, setIsBlank] = useState(false);
  const [course, setCourse] = useState([]);
  const [users, setUsers] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);
  const loadCourse = useCallback(async () => {
    const response = await axios.get(`/api/courses/${courseId}`);
    setCourse(response.data);
  }, [courseId]);
  const loadUsers = useCallback(() => {
    axios.get(`/api/users`).then((res) => setUsers(res.data));
  }, []);
  useEffect(() => {
    loadUsers();
    loadCourse();
  }, [loadCourse, loadUsers]);
  const addCommentRating = async (commentId, courseId, userId, type) => {
    const rating = {
      type,
      commentId,
      courseId,
      userId,
    };

    try {
      const ratingResponse = await axios.post("/api/comments/rating", {
        rating,
      });
      loadCourse();
    } catch (errors) {
      console.log(errors);
    }
  };
  const addComment = async (e) => {
    e.preventDefault();
    if (!comment) {
      setIsBlank(true);
      setError("Comment can not be blank!");
    } else {
      try {
        const res = await axios.post("/api/comments", {
          comment,
          userId: user.id,
          courseId,
        });
        setComment("");
        if (res.status === 200) {
          loadCourse();
        }
      } catch (error) {
        setIsBlank(true);
        setError("Comment can not be blank!");
        console.log(error);
      }
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
      if (res.status === 200) {
        loadCourse();
      }
    } catch (errors) {
      console.log(errors);
    }
  };

  const addRating = async (newValue, userId, courseId) => {
    const rating = {
      value: newValue,
      userId,
      courseId,
    };
    try {
      const res = await axios.post("/api/rating", { rating });
    } catch (errors) {
      console.log(errors);
    }

    setRatingValue(newValue);
  };
  const goBack = () => {
    router.back();
  };
  return (
    <Layout user={user} title={course?.title} courseTitle={course?.title}>
      {!course ? (
        <div className={`${s.networkError}`}>
          <span>Network error. Try to reload a page.</span>
        </div>
      ) : (
        <div className="container mt-10">
          <div className="p-5 mb-4 bg-body-tertiary rounded-3 mt-4">
            <div className="container-fluid">
              <button
                onClick={() => goBack()}
                className="btn btn-primary back-btn"
              >
                &#8592; Back
              </button>
              <h1 className="display-5 fw-bold text-center mb-3">
                {course.title}
              </h1>

              <div className="image-ibg-course-details">
                <Image
                  src={course.image}
                  alt=""
                  className="float p-3 radius-img"
                  width="800"
                  height="400"
                />
              </div>

              <p className="fs-4 px-3">{course.description}</p>
              <Rating
                name="simple-controlled"
                value={ratingValue}
                onChange={(e, newValue) => {
                  addRating(newValue, user.id, courseId);
                }}
              />
            </div>
          </div>
          <section className="d-flex ">
            <Comment.Group className="w-100 mt-4">
              <Header as="h3" dividing>
                Comments
              </Header>
              {course?.comments?.map((comment) => {
                const likes = comment.rating?.likes;
                const dislikes = comment.rating?.dislikes;
                const commentUser = users.find(
                  (user) => user.id === comment.userId
                );
                return (
                  <Comment key={comment.id} className={s.comment}>
                    <Comment.Avatar src={commentUser?.ava} />
                    <Comment.Content>
                      <Comment.Author as="a">
                        {commentUser?.firstName}
                      </Comment.Author>
                      <Comment.Metadata>
                        <div>Today at 5:42PM</div>
                        {(user.id === comment.userId ||
                          user.role === "admin") && (
                          <div
                            onClick={() =>
                              deleteComment(comment.id, courseId, user.id)
                            }
                            className={s.deleteComment}
                          >
                            <img
                              src="/images/tech/deleteComment.svg"
                              alt=""
                              width={22}
                            />
                          </div>
                        )}
                      </Comment.Metadata>
                      <Comment.Text>{comment.body}</Comment.Text>
                      <Comment.Actions className="d-flex justify-content-end align-items-center fw-bold">
                        <div className="d-flex align-items-center ">
                          <span className="">{likes.length}</span>
                          <svg
                            width="30px"
                            height="30px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cursor-pointer like mt-o"
                            onClick={() =>
                              addCommentRating(
                                comment.id,
                                course.id,
                                user.id,
                                "like"
                              )
                            }
                          >
                            <path
                              d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="">{dislikes?.length}</span>
                          <svg
                            width="30px"
                            height="30px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="align-self-end dislike cursor-pointer"
                            onClick={() =>
                              addCommentRating(
                                comment.id,
                                course.id,
                                user.id,
                                "dislike"
                              )
                            }
                          >
                            <path
                              d="M8 14V4M8 14L4 14V4.00002L8 4M8 14L13.1956 20.0615C13.6886 20.6367 14.4642 20.884 15.1992 20.7002L15.2467 20.6883C16.5885 20.3529 17.1929 18.7894 16.4258 17.6387L14 14H18.5604C19.8225 14 20.7691 12.8454 20.5216 11.6078L19.3216 5.60779C19.1346 4.67294 18.3138 4.00002 17.3604 4.00002L8 4"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </Comment.Actions>
                    </Comment.Content>
                  </Comment>
                );
              })}
              <Form reply>
                <Form.TextArea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  onClick={(e) => addComment(e)}
                />
              </Form>
            </Comment.Group>
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
  if (user === undefined) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
},
sessionOptions);
