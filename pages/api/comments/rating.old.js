import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "POST") {
    const rating = req.body.rating;
    inmemoryDb.addCommentRating(rating);
    return res.status(200).end();
  }
}
