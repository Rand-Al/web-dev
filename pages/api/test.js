import service from "../../data/firestore/service.js";
import dbFirestore from "../../data/firestore/firestore.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res
      .status(200)
      .json(await service.getCourseRating(dbFirestore, req.query.id));
  }
  if (req.method === "POST") {
    const rating = req.body;
    const image = "/123.webp";
    await service.addCourseRating(
      dbFirestore,
      rating.value,
      rating.courseId,
      rating.userId
    );
    res.status(200).end();
  }
}
