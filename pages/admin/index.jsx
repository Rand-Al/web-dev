import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import Layout from "../Layout";
import AdminLayout from "@/layout/AdminLayout";

const Admin = ({ children, user }) => {
  console.log(user);
  return <div className="d-flex">{children}</div>;
};

export default Admin;
Admin.Layout = AdminLayout;
export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  console.log(user);
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
