import service from "../../../data/firestore/service";
import dbFirestore from "../../../data/firestore/firestore.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const value = req.body.rating.value;
    const userId = req.body.rating.userId;
    const courseId = req.body.rating.courseId;
    await service.addCourseRating(dbFirestore, value, courseId, userId);
    return res.status(200).end();
  }
}
