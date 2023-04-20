// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(inmemoryDb.getUsers());
  }
  if (req.method === "PUT") {
    if (req.body[0]?.is === false) {
      inmemoryDb.approve(req.body[0].id);
      return res.status(200).end();
    }
    const user = req.body;
    inmemoryDb.editUser(user);
    return res.status(200).end();
  }
}
