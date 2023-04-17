import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "DELETE") {
    inmemoryDb.deny(Number(req.query.id));
    return res.status(200).end();
  }
}
