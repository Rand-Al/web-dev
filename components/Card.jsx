import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Rating } from "@mui/material";

const Card = ({ course, ratingValue, setRatingValue }) => {
  return (
    <div className="card card-width">
      <div className="image-ibg ">
        <img
          src={course.image}
          className="card-img-top radius"
          width={340}
          height={150}
          alt="..."
        />
      </div>

      <div className="card-body">
        <h5 className="card-title">{course.title}</h5>
        <p className="card-text overflow">{course.description}</p>
        <div className="d-flex align-items-center justify-content-between">
          <Link href={`/courses/${course.id}`} className="btn btn-primary">
            Details
          </Link>
          <Rating name="read-only" value={ratingValue} readOnly />
        </div>
      </div>
    </div>
  );
};

export default Card;
