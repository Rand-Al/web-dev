import axios from "axios";
import Layout from "./Layout";
import Card from "@/components/Card";

export default function Home({ coursesList }) {
  return (
    <Layout title={"Home page"}>
      <div className="container">
        <div class="p-5 mb-4 bg-body-tertiary rounded-3 my-4 ">
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
export async function getServerSideProps() {
  const res = await axios.get(`http://127.0.0.1:3000/api/courses`);
  const coursesList = res.data;
  return { props: { coursesList } };
}
