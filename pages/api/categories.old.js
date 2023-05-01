import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(inmemoryDb.getCategories());
  }
  if (req.method === "POST") {
    const categories = req.body.categories.split(", ");
    inmemoryDb.addCategories(categories);
    return res.status(200).end();
  }
}
