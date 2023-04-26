import Layout from "@/pages/Layout";
import AdminLayout from "@/layout/AdminLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { useState } from "react";
import { useRouter } from "next/router";
import s from "../../../styles/Categories.module.css";
import axios from "axios";

const Categories = ({ categoriesList }) => {
  const router = useRouter();
  const [categories, setCategories] = useState(categoriesList.join(", "));
  const [isBlank, setIsBlank] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleCategories = async (e) => {
    e.preventDefault();
    try {
      const resCategories = await axios.post("/api/categories", {
        categories: categories,
      });
      if (resCategories.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push(`/admin/courses`);
        }, 2000);
      }
    } catch (errors) {
      console.log(errors);
    }
  };
  return (
    <Layout>
      <AdminLayout>
        <form
          className="px-4 my-4 w-100 d-flex flex-column "
          onSubmit={(e) => handleCategories(e)}
        >
          {isSuccess && (
            <div className={`${s.success} container`}>
              Categories successfully changed!
            </div>
          )}
          <h2 className="">Add Categories</h2>
          <p className="">Categories is separated by coma and space.</p>
          <div className="form-floating mb-2 d-flex flex-column">
            <input
              type="text"
              className="form-control"
              id="floatingFirstName"
              placeholder="Categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            />
            <label htmlFor="floatingFirstName">Categories</label>
          </div>
          <button
            className=" btn btn-lg btn-primary align-self-end"
            type="submit"
          >
            Confirm changes
          </button>
        </form>
      </AdminLayout>
    </Layout>
  );
};

export default Categories;

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;
  const resCategories = await axios.get(`http://127.0.0.1:3000/api/categories`);
  const categoriesList = resCategories.data;
  if (user === undefined) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { categoriesList, user: req.session.user },
  };
},
sessionOptions);
