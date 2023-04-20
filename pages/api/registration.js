import inmemoryDb from "@/data/inmemoryDb";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

async function handler(req, res) {
  if (req.method === "POST") {
    const user = req.body;
    user.role = "user";
    user.isApproved = false;
    inmemoryDb.addUser(user);
    res.status(200).end();
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
