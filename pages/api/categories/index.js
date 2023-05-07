import service from "../../../data/firestore/service.js";
import dbFirestore from "../../../data/firestore/firestore.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(await service.getCategories(dbFirestore));
  }
  if (req.method === "POST") {
    if (req.body.delete === true) {
      const categoryId = req.body.categoryId;
      await service.deleteCategory(dbFirestore, categoryId);
      res.status(200).end();
    } else {
      const category = req.body.title;
      await service.addCategory(dbFirestore, category);
      res.status(200).end();
    }
  }
}
