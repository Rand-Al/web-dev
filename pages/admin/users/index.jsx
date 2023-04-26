import Layout from "@/pages/Layout";
import axios from "axios";
import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import AdminLayout from "@/layout/AdminLayout";

const UsersTable = ({ usersList, user }) => {
  const [users, setUsers] = useState(usersList);
  const [searchValue, setSearchValue] = useState("");
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
          <div className="d-flex align-items-center gap-3">
            <h2>Users</h2>{" "}
            <form className="d-flex w-100 search">
              <input
                className="form-control me-2 w-100 search-input"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <div className="search-img">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="25px"
                  height="25px"
                >
                  <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
                </svg>
              </div>
            </form>
          </div>

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
              {users
                .filter((user) =>
                  user.firstName
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                )
                .map((user) => {
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
