import AdminLayout from "@/layout/AdminLayout";

const Admin = ({ children }) => {
  return <div className="d-flex">{children}</div>;
};

export default Admin;
Admin.Layout = AdminLayout;
