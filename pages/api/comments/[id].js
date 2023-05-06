import service from "../../../data/firestore/service";
import dbFirestore from "../../../data/firestore/firestore.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res
      .status(200)
      .json(await service.getCourseComments(dbFirestore, req.query.id));
  }
}
