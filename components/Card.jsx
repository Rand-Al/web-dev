import Link from "next/link";
import React from "react";
import axios from "axios";
import Image from "next/image";
import { Rating } from "@mui/material";
import { useState, useEffect } from "react";

const Card = ({ course }) => {
  const [ratingValue, setRatingValue] = useState(5);
  useEffect(() => {
    const fetchRating = async () => {
      const res = await axios.get(`/api/rating/${course.id}`);
      setRatingValue(Number(res.data));
    };
    fetchRating();
  }, [course.id]);

  const pluralize = (count, noun, suffix = "s") =>
    `${count} ${noun}${count !== 1 ? suffix : ""}`;
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
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="card-title mb-0">{course.title}</h5>
          <Rating name="read-only" value={ratingValue} readOnly />
        </div>

        <p className="card-text overflow">{course.description}</p>
        <div className="d-flex align-items-center justify-content-between">
          <Link href={`/courses/${course.id}`} className="btn btn-primary">
            Details
          </Link>
          <div>{pluralize(course.comments.length, "comment")}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
