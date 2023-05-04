import service from "../../data/firestore/service.js";
import dbFirestore from "../../data/firestore/firestore.js";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

async function handler(req, res) {
  if (req.method === "POST") {
    const user = req.body;
    const dbUsers = await service.getUsers(dbFirestore);
    const dbUser = dbUsers.find((u) => u.email === user.email);
    if (dbUser) {
      res.status(409).json("User with this email already exists!");
    } else {
      user.role = "user";
      user.isApproved = false;
      await service.addUser(dbFirestore, user);
      res.status(200).end();
    }
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
