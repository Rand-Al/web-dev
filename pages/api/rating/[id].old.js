import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res
      .status(200)
      .json(inmemoryDb.getCourseRating(Number(req.query.id)));
  }
}
