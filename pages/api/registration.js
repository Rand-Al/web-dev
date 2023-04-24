import inmemoryDb from "@/data/inmemoryDb";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

async function handler(req, res) {
  if (req.method === "POST") {
    const user = req.body;
    const dbUser = inmemoryDb
      .getUsers()
      .find((dbUser) => dbUser.email === user.email);
    if (dbUser) {
      res.status(409).json("User with this email already exists!");
    } else {
      user.role = "user";
      user.isApproved = false;
      inmemoryDb.addUser(user);
      res.status(200).end();
    }
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
