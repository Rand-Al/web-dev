import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import inmemoryDb from "@/data/inmemoryDb";

async function loginRoute(req, res) {
  const user = await req.body;
  const dbUser = inmemoryDb
    .getUsers()
    .find((dbUser) => dbUser.email === user.email);
  if (
    !user ||
    user.email !== dbUser.email ||
    user.password !== dbUser.password
  ) {
    res.status(401).end();
  }
  if (dbUser.isApproved === false) {
    res.status(403).json("Your account is not approved!");
  }
  const sessionUser = {
    isLoggedIn: true,
    login: user.email,
    role: dbUser.role,
    id: dbUser.id,
  };
  req.session.user = sessionUser;

  await req.session.save();

  res.status(200).end();
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
