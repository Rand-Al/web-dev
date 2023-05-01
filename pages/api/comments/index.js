import service from "../../../data/firestore/service";
import dbFirestore from "../../../data/firestore/firestore.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
  }
  if (req.method === "POST") {
    if (req.body.delete === true) {
      const id = req.body.id;
      const userId = req.body.userId;
      const courseId = req.body.courseId;
      await service.deleteComment(dbFirestore, id, courseId, userId);
      res.status(200).end();
    } else {
      const comment = req.body.comment;
      if (comment.length === 0 || !comment) {
        res.status(405).json("Body can not be blank!");
      }
      const userId = req.body.userId;
      const courseId = req.body.courseId;
      await service.addComment(dbFirestore, comment, userId, courseId);
      res.status(200).end();
    }
  }
}
