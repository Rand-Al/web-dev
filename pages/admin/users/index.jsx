import Layout from "@/pages/Layout";
import axios from "axios";
import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import AdminLayout from "@/layout/AdminLayout";
import { useRouter } from "next/router";
import s from "../../../styles/Table.module.css";
import firestoreDb from "../../../data/firestore/firestore";
import f from "../../../data/firestore/service";
import Image from "next/image";

const UsersTable = ({ usersList, user }) => {
  const router = useRouter();
  const [users, setUsers] = useState(usersList);
  const [searchValue, setSearchValue] = useState("");
  const changeStatus = async (id, isApproved) => {
    const res = await axios.put("/api/users", [{ id: id, is: isApproved }]);
    console.log(res);
    setUsers((prev) => {
      const user = prev.find((user) => user.id === id);
      user.isApproved = true;
      return [...prev];
    });
  };
  const deleteUser = async (id) => {
    const res = await axios.delete(`/api/users/${id}`, { data: id });
    console.log(res);
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };
  const goBack = () => {
    router.back();
  };
  return (
    <Layout user={user} title={"Users"}>
      <AdminLayout>
        <div className="container py-4">
          <button onClick={() => goBack()} className="btn btn-primary mb-2">
            &#8592; Back
          </button>
          <div className="d-flex gap-3">
            <h2>Users</h2>{" "}
            <form className="d-flex w-100 search mb-3">
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
          <table class={`${s.respTab}`}>
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Phone</th>
                <th>isApproved</th>
                <th>Role</th>
                <th></th>
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
                      <td>{user.email}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.age}</td>
                      <td>
                        <div className={s.height}>{user.phone}</div>
                      </td>
                      <td>
                        <div
                          onClick={() => changeStatus(user.id, user.isApproved)}
                          disabled={user.isApproved}
                          className={`${!user.isApproved && s.pic} text-center`}
                        >
                          {user.isApproved ? (
                            "Approved"
                          ) : (
                            <Image
                              src="/images/tech/edit.svg"
                              alt=""
                              className="text-center"
                              width={30}
                              height={30}
                            />
                          )}
                        </div>
                      </td>
                      <td>{user.role}</td>
                      <td>
                        {!user.isApproved && (
                          <div
                            onClick={() => deleteUser(user.id)}
                            className={s.pic}
                          >
                            <Image
                              src="/images/tech/delete.svg"
                              alt=""
                              width={30}
                              height={30}
                            />
                          </div>
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
  const usersList = await f.getUsers(firestoreDb);

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
