// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(inmemoryDb.getUsers());
  }
  if (req.method === "PUT") {
    inmemoryDb.approve(req.body[0].id);
    return res.status(200).end();
  }
}
