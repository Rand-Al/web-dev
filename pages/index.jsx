import axios from "axios";
import Card from "@/components/Card";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import Layout from "./Layout";

export default function Home({ coursesList, user }) {
  return (
    <Layout user={user}>
      <div className="container">
        <div className="p-5 mb-4 bg-body-tertiary rounded-3 my-4 ">
          <h1 className="text-center mb-4">
            From Novice to Pro: Dynamic Web Developer Courses for Every Skill
            Level
          </h1>

          <div className="d-flex justify-content-between flex-wrap ">
            {coursesList.map((course) => (
              <Card key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  const resUser = await axios.get(`http://127.0.0.1:3000/api/courses`);
  const coursesList = resUser.data;
  if (user === undefined) {
    return {
      props: { coursesList },
    };
  }

  return {
    props: { coursesList, user: req.session.user },
  };
},
sessionOptions);
