import { useRouter } from "next/router";
import axios from "axios";
import Layout from "../Layout";
import Image from "next/image";

const Course = ({ coursesList }) => {
  const router = useRouter();
  const courseId = Number(router.query.id);
  const course = coursesList.filter((course) => course.id === courseId)[0];
  console.log(course);
  return (
    <Layout title={`${course.title}`}>
      <div className="container mt-10">
        <div class="p-5 mb-4 bg-body-tertiary rounded-3">
          <div class="container-fluid">
            <h1 class="display-5 fw-bold text-center">{course.title}</h1>
            <img src={course.image} alt="" className="float p-3 radius-img" />

            <p class="fs-4 px-3">{course.description}</p>
          </div>
        </div>
        <section class="w-100 p-4">
          <div class="row d-flex justify-content-center text-dark">
            <div class="col-md-11 col-lg-9 col-xl-7">
              <div class="d-flex flex-start mb-4">
                <img
                  class="rounded-circle shadow-1-strong me-3"
                  src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp"
                  alt="avatar"
                  width="65"
                  height="65"
                />
                <div class="card w-100">
                  <div class="card-body p-4">
                    <div class="">
                      <h5>Johny Cash</h5>
                      <p class="small">3 hours ago</p>
                      <p>
                        Cras sit amet nibh libero, in gravida nulla. Nulla vel
                        metus scelerisque ante sollicitudin. Cras purus odio,
                        vestibulum in vulputate at, tempus viverra turpis. Fusce
                        condimentum nunc ac nisi vulputate fringilla. Donec
                        lacinia congue felis in faucibus ras purus odio,
                        vestibulum in vulputate at, tempus viverra turpis.
                      </p>

                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                          <a href="#!" class="link-muted me-2">
                            <i class="fas fa-thumbs-up me-1"></i>132
                          </a>
                          <a href="#!" class="link-muted">
                            <i class="fas fa-thumbs-down me-1"></i>15
                          </a>
                        </div>
                        <a href="#!" class="link-muted">
                          <i class="fas fa-reply me-1"></i> Reply
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div class="card-body p-4">
          <div class="d-flex flex-start w-100">
            <img
              class="rounded-circle shadow-1-strong me-3"
              src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp"
              alt="avatar"
              width="65"
              height="65"
            />
            <div class="w-100">
              <h5>Add a comment</h5>
              <div class="form-outline">
                <textarea
                  class="form-control"
                  id="textAreaExample"
                  rows="4"
                ></textarea>
                <label class="form-label" for="textAreaExample">
                  What is your view?
                </label>
                <div class="form-notch">
                  <div class="form-notch-leading"></div>
                  <div class="form-notch-middle"></div>
                  <div class="form-notch-trailing"></div>
                </div>
              </div>
              <div class="d-flex mt-3 flex-row-reverse">
                <button type="button" class="btn btn-success ">
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
export async function getServerSideProps() {
  const res = await axios.get(`http://127.0.0.1:3000/api/courses`);
  const coursesList = res.data;
  return { props: { coursesList } };
}
export default Course;
