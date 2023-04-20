import Link from "next/link";
import React from "react";
import Image from "next/image";

const Card = ({ course }) => {
  return (
    <div className="card card-width">
      <img
        src={course.image}
        className="card-img-top radius"
        width={340}
        height={150}
        alt="..."
      />
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
