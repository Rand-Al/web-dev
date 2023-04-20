import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import axios from "axios";
import Layout from "../Layout";
import Image from "next/image";

const Course = ({ coursesList, user }) => {
  const router = useRouter();
  const courseId = Number(router.query.id);
  const course = coursesList.filter((course) => course.id === courseId)[0];
  return (
    <Layout user={user} title={course.title} courseTitle={course.title}>
      <div className="container mt-10">
        <div className="p-5 mb-4 bg-body-tertiary rounded-3 mt-4">
          <div className="container-fluid">
            <h1 className="display-5 fw-bold text-center">{course.title}</h1>
            <img src={course.image} alt="" className="float p-3 radius-img" />

            <p className="fs-4 px-3">{course.description}</p>
          </div>
        </div>
        <section className="w-100 p-4">
          <div className="row d-flex justify-content-center text-dark">
            <div className="col-md-11 col-lg-9 col-xl-7">
              <div className="d-flex flex-start mb-4">
                <img
                  className="rounded-circle shadow-1-strong me-3"
                  src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp"
                  alt="avatar"
                  width="65"
                  height="65"
                />
                <div className="card w-100">
                  <div className="card-body p-4">
                    <div className="">
                      <h5>Johny Cash</h5>
                      <p className="small">3 hours ago</p>
                      <p>
                        Cras sit amet nibh libero, in gravida nulla. Nulla vel
                        metus scelerisque ante sollicitudin. Cras purus odio,
                        vestibulum in vulputate at, tempus viverra turpis. Fusce
                        condimentum nunc ac nisi vulputate fringilla. Donec
                        lacinia congue felis in faucibus ras purus odio,
                        vestibulum in vulputate at, tempus viverra turpis.
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <a href="#!" className="link-muted me-2">
                            <i className="fas fa-thumbs-up me-1"></i>132
                          </a>
                          <a href="#!" className="link-muted">
                            <i className="fas fa-thumbs-down me-1"></i>15
                          </a>
                        </div>
                        <a href="#!" className="link-muted">
                          <i className="fas fa-reply me-1"></i> Reply
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="card-body p-4">
          <div className="d-flex flex-start w-100">
            <img
              className="rounded-circle shadow-1-strong me-3"
              src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp"
              alt="avatar"
              width="65"
              height="65"
            />
            <div className="w-100">
              <h5>Add a comment</h5>
              <div className="form-outline">
                <textarea
                  className="form-control"
                  id="textAreaExample"
                  rows="4"
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
                <button type="button" className="btn btn-success ">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  if (user === undefined) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { coursesList, user: req.session.user },
  };
},
sessionOptions);
