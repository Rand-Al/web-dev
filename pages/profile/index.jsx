import Layout from "../Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

const Profile = ({ user }) => {
  return <Layout user={user}></Layout>;
};

export default Profile;


export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  console.log(req);
  const user = req.session.user;
  if (user === undefined) {
    return {
      props: {},
    };
  }

  return {
    props: { user: req.session.user },
  };
},
sessionOptions);
