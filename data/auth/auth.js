import withSession from "../../lib/session";

function _withAuth(handler) {
  return async (context) => {
    const { req } = context;

    const user = req.session.user;
    if (!user) {
      // 'redirecting to /login because there is not user'
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const newCtx = {
      ...context,
      user,
    };

    return handler(newCtx);
  };
}

export default function withAuth(handler) {
  return withSession(_withAuth(handler));
}
