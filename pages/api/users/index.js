// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import service from "../../../data/firestore/service";
import dbFirestore from "../../../data/firestore/firestore.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(await service.getUsers(dbFirestore));
  }
  if (req.method === "PUT") {
    if (req.body[0]?.is === false) {
      await service.approveUser(dbFirestore, req.body[0].id);
      return res.status(200).end();
    }
    const user = req.body;
    await service.editUser(dbFirestore, user);
    return res.status(200).end();
  }
  if (req.method === "POST") {
    await service.editAva(dbFirestore, req.body.userId, req.body.filepath);
    return res.status(200).end();
  }
}
