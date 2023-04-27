import Layout from "../Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import axios from "axios";
import s from "../../styles/Profile.module.css";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const Profile = ({ usersList, user }) => {
  const router = useRouter();
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    usersList.find((userFromDb) => {
      return userFromDb.email === user.login;
    })
  );
  const [avatar, setAvatar] = useState(null);
  const [fileName, setFileName] = useState("");
  const getFullName = (firstName, lastName) => {
    return `${firstName} ${lastName}`;
  };
  const fullName = getFullName(currentUser.firstName, currentUser.lastName);
  const [isEdit, setIsEdit] = useState(false);
  const handleEdit = async () => {
    try {
      const usersResponse = await axios.put("/api/users", currentUser);
      setIsEdit(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  const uploadImageToState = async (e) => {
    if (e.target.files[0]) {
      e.preventDefault();
      const i = e.target.files[0];
      const fileName = e.target.value.match(/.*\\(.*)/)[1];
      setFileName(fileName);
      setAvatar(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const handleImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatar);
    const responseUpload = await axios.post("/api/upload", formData);
    const { filePath } = await responseUpload.data;
    const url = filePath;
    const path = url.match(/\/[\w.-]+\.[\w]+$/)[0];
    const responseUser = await axios.post(`/api/users`, {
      filepath: path,
      userId: currentUser.id,
    });
    if (responseUser.status === 200) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }
    setFileName("");
  };
  return (
    <Layout user={user} title={"Profile"}>
      {isSuccess && (
        <div className={`${s.success} container`}>Successfully changed!</div>
      )}
      {isEdit ? (
        <section
          className={`w-100 p-4 ${s.bgBorder} container d-flex gap-3 mt-60 flex-column mb-60`}
        >
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="floatingFirstName"
              placeholder="First Name"
              value={currentUser.firstName}
              onChange={(e) =>
                setCurrentUser((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
            />
            <label htmlFor="floatingFirstName">First Name</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="floatingLastName"
              placeholder="Password"
              value={currentUser.lastName}
              onChange={(e) =>
                setCurrentUser((prev) => ({
                  ...prev,
                  lastName: e.target.value,
                }))
              }
            />
            <label htmlFor="floatingLastName">Last Name</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="floatingPhone"
              placeholder="Phone"
              value={currentUser.phone}
              onChange={(e) =>
                setCurrentUser((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
            <label htmlFor="floatingPhone">Phone</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="floatingAge"
              placeholder="Age"
              value={currentUser.age}
              onChange={(e) =>
                setCurrentUser((prev) => ({ ...prev, age: e.target.value }))
              }
            />
            <label htmlFor="floatingAge">Age</label>
          </div>

          <button
            onClick={() => handleEdit()}
            className="btn btn-success align-self-end"
          >
            Save Changes
          </button>
        </section>
      ) : (
        <section
          className={`w-100 p-4 ${s.bgBorder} container d-flex gap-3 mb-60 mt-60 flex-wrap`}
        >
          <div
            className={`card-body text-center card mb-4 flexBasis ${s.flexBasis}`}
          >
            <div className="card-body text-center">
              <Image
                src={createObjectURL ? createObjectURL : currentUser.ava}
                alt="avatar"
                className={`rounded img-fluid `}
                width={`150`}
                height={`200`}
              />

              <h5 className="my-3">{fullName}</h5>

              <form
                onSubmit={handleImage}
                className="d-flex gap-2 justify-content-center flex-wrap"
              >
                <label htmlFor="avatar" className="btn btn-primary">
                  {fileName ? fileName : "Chose Photo"}
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={(e) => uploadImageToState(e)}
                    className="absolute"
                  />
                </label>
                <button
                  disabled={fileName ? false : true}
                  type="submit"
                  className="btn btn-primary"
                >
                  Change Photo
                </button>
              </form>
            </div>
          </div>
          <div className="card-body text-center card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3">
                  <p className={`mb-0 ${s.fontXXl}`}>Full Name</p>
                </div>
                <div className="col-sm-9">
                  <p className={`text-muted mb-0 ${s.fontXl}`}>{fullName}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className={`mb-0 ${s.fontXXl}`}>Email</p>
                </div>
                <div className="col-sm-9">
                  <p className={`text-muted mb-0 ${s.fontXl}`}>
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className={`mb-0 ${s.fontXXl}`}>Phone</p>
                </div>
                <div className="col-sm-9">
                  <p className={`text-muted mb-0 ${s.fontXl}`}>
                    {currentUser.phone}
                  </p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className={`mb-0 ${s.fontXXl}`}>Age</p>
                </div>
                <div className="col-sm-9">
                  <p className={`text-muted mb-0 ${s.fontXl}`}>
                    {currentUser.age}
                  </p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-9">
                  <p
                    className={`text-muted mb-0 ${s.fontXl} d-flex justify-content-end`}
                  >
                    <button
                      onClick={() => setIsEdit(!isEdit)}
                      className="btn btn-warning text-muted"
                    >
                      Change Information
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Profile;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  const resUser = await axios.get(`${process.env.API_URL}/api/users`);
  const usersList = resUser.data;
  if (user === undefined) {
    return {
      props: {},
    };
  }

  return {
    props: { usersList, user: req.session.user },
  };
},
sessionOptions);
