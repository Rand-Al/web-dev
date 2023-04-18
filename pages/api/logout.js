import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

function logoutRoute(req, res) {
  req.session.destroy();
  res.status(200).end();
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
