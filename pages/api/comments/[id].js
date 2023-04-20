import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "DELETE") {
    console.log(req.query);
    return res.status(200).end();
  }
}
