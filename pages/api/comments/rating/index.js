import service from "../../../../data/firestore/service.js";
import dbFirestore from "../../../../data/firestore/firestore.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const rating = req.body.rating;
    await service.addCommentRating(dbFirestore, rating);
    res.status(200).end();
  }
}
