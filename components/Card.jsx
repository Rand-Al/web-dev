import Link from "next/link";
import React from "react";

const Card = ({ course }) => {
  return (
    <div className="card card-width">
      <img src={course.image} className="card-img-top radius" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{course.title}</h5>
        <p className="card-text overflow">{course.description}</p>
        <Link href={`/courses/${course.id}`} className="btn btn-primary">
          Details
        </Link>
      </div>
    </div>
  );
};

export default Card;

export async function getServerSideProps() {
  const res = await axios.get(`http://127.0.0.1:3000/api/courses`);
  const coursesList = res.data;
  return { props: { coursesList } };
}
