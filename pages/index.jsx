import Card from "@/components/Card";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import Layout from "./Layout";
import axios from "axios";
import s from "../styles/Home.module.css";

export default function Home({ coursesList, user }) {
  return (
    <Layout user={user} title={"Home"}>
      {!coursesList ? (
        <div className={`${s.networkError}`}>
          <span>Network error. Try to reload a page.</span>
        </div>
      ) : (
        <div className="container">
          <div className="p-5 mb-4 bg-body-tertiary rounded-3 my-4 ">
            <h1 className="text-center mb-4">
              From Novice to Pro: Dynamic Web Developer Courses for Every Skill
              Level
            </h1>

            <div className="d-flex align-items-center justify-content-center flex-wrap gap-3">
              {coursesList.map((course) => (
                <Card key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  const resCourse = await axios.get(`http://127.0.0.1:3000/api/courses`);
  const coursesList = resCourse.data;
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
