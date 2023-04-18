export const sessionOptions = {
  password: "supersecretmustbeatleast32characterslong",
  cookieName: "iron-session",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
