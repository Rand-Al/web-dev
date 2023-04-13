import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "POST") {
    const user = req.body;
    user.role = "user";
    user.isApproved = false;
    inmemoryDb.addUser(user);
    res.status(201).end();
  }
}
