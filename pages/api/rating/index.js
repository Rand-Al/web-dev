import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "POST") {
    const rating = req.body.rating.value;
    const userId = req.body.rating.userId;
    const courseId = req.body.rating.courseId;
    inmemoryDb.addCourseRating(rating, courseId, userId);
    return res.status(200).end();
  }
}
