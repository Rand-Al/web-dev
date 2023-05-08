import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import service from "../../data/firestore/service.js";
import dbFirestore from "../../data/firestore/firestore.js";
const crypto = require("crypto");

async function loginRoute(req, res) {
  const user = await req.body;
  const salt = "dove";
  const hashPassword = crypto
    .createHash("sha256")
    .update(user.password + salt)
    .digest("hex");
  const dbUsers = await service.getUsers(dbFirestore);
  const dbUser = dbUsers.find((dbUser) => dbUser.email === user.email);
  if (
    !dbUser ||
    !user ||
    user.email !== dbUser.email ||
    hashPassword !== dbUser.password
  ) {
    res.status(401).json("Incorrect email and/or password!");
  }
  if (dbUser?.isApproved === false) {
    res.status(403).json("Your account is not approved!");
  }
  const sessionUser = {
    isLoggedIn: true,
    login: user.email,
    role: dbUser?.role,
    id: dbUser?.id,
    fullName: dbUser?.firstName + " " + dbUser?.lastName,
    ava: dbUser.ava,
  };
  req.session.user = sessionUser;

  await req.session.save();

  res.status(200).end();
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
