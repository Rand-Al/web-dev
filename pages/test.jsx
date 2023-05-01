import axios from "axios";
import React, { useEffect, useState } from "react";

const Test = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const userRes = await axios.get(`/api/test`);
      setUsers(userRes.data);
    };
    fetchUsers();
  }, []);
  return (
    <div>
      {users.map((user) => {
        return (
          <ul key={user.id}>
            <li>{user.firstName}</li>
            <li>{user.lastName}</li>
            <li>{user.age}</li>
          </ul>
        );
      })}
    </div>
  );
};

export default Test;

// export async function getServerSideProps() {
//   const res = await axios.get(`${process.env.API_URL}/api/test`);
//   const usersList = res.data;
//   return { props: { usersList } };
// }
