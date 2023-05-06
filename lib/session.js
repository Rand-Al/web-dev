import { withIronSession } from "iron-session/next";

export const sessionOptions = {
  password:
    process.env.SECRET_COOKIE_PASSWORD ||
    "some-really-long-password-with-32-bites-minimum",
  cookieName: "my-awesome-cookie-name",
  cookieOptions: {
    // the next line allows to use the session in non-https environements like
    // Next.js dev mode (http://localhost:3000)
    secure: process.env.NODE_ENV === "production",
  },
};

export default function withSession(handler) {
  return withIronSession(handler, sessionOptions);
}
