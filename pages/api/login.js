import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

async function loginRoute(req, res) {
  const user = await req.body;

  if (!user || user.email !== "admin@gmail.com" || user.password !== "123456") {
    res.status(401).end();
  }
  const sessionUser = { isLoggedIn: true, login: user.email };
  req.session.user = sessionUser;

  await req.session.save();

  res.status(200).end();
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
