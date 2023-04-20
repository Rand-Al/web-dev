import Layout from "@/pages/Layout";
import axios from "axios";
import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import AdminLayout from "@/layout/AdminLayout";

const UsersTable = ({ usersList, user }) => {
  const [users, setUsers] = useState(usersList);
  const changeStatus = (id, isApproved) => {
    axios
      .put("/api/users", [{ id: id, is: isApproved }])
      .then((res) => console.log(res));
    setUsers((prev) => {
      const user = prev.find((user) => user.id === id);
      user.isApproved = true;
      return [...prev];
    });
  };
  const deleteUser = (id) => {
    axios
      .delete(`/api/users/${id}`, { data: id })
      .then((res) => console.log(res));
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };
  return (
    <Layout user={user} title={"Users"}>
      <AdminLayout>
        <div className="table-responsive flex-grow-1 p-3">
          <h2>Users</h2>
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th scope="col">User Id</th>
                <th scope="col">Email</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Age</th>
                <th scope="col">Phone</th>
                <th scope="col">isApproved</th>
                <th scope="col">Role</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.age}</td>
                    <td>{user.phone}</td>
                    <td>
                      <button
                        onClick={() => changeStatus(user.id, user.isApproved)}
                        disabled={user.isApproved}
                        className="btn btn-warning"
                      >
                        {user.isApproved ? "true" : "false"}
                      </button>
                    </td>
                    <td>{user.role}</td>
                    <td>
                      {!user.isApproved && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </Layout>
  );
};

export default UsersTable;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  const resUsers = await axios.get(`http://localhost:3000/api/users`);
  const usersList = resUsers.data;
  console.log(user);
  if (user === undefined) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { user: req.session.user, usersList },
  };
},
sessionOptions);
