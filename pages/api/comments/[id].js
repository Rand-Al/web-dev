import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "DELETE") {
    return res.status(200).end();
  }
}
