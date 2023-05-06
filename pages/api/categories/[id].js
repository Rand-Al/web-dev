import service from "../../../data/firestore/service.js";
import dbFirestore from "../../../data/firestore/firestore.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res
      .status(200)
      .json(await service.getCourse(dbFirestore, req.query.id));
  }
}
