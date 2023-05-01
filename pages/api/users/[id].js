import service from "../../../data/firestore/service";
import dbFirestore from "../../../data/firestore/firestore.js";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    service.deleteUser(dbFirestore, req.query.id);
    return res.status(200).end();
  }
}
