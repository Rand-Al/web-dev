import service from "../../../data/firestore/service";
import dbFirestore from "../../../data/firestore/firestore.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(await service.getComments(dbFirestore));
  }
  if (req.method === "POST") {
    if (req.body.delete === true) {
      const id = req.body.id;
      const userId = req.body.userId;
      const courseId = req.body.courseId;
      service.deleteComment(id, courseId, userId);
      res.status(200).end();
    } else {
      const comment = { body: req.body.comment };
      const userId = req.body.userId;
      const courseId = req.body.courseId;
      inmemoryDb.addComment(comment, userId, courseId);
      res.status(200).end();
    }
  }
}
