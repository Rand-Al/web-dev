import Layout from "@/pages/Layout";
import AdminLayout from "@/layout/AdminLayout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { useState } from "react";
import { useRouter } from "next/router";
import s from "../../../styles/Categories.module.css";
import axios from "axios";
import firestoreDb from "../../../data/firestore/firestore";
import f from "../../../data/firestore/service";

const Categories = ({ categoriesList, user }) => {
  const router = useRouter();
  const [categories, setCategories] = useState(categoriesList);
  const [category, setCategory] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const handleCategories = async (e) => {
    e.preventDefault();
    try {
      if (category.length > 1) {
        const res = await axios.post(`/api/categories`, { title: category });
        if (res.status === 200) {
          const res = await axios.get("/api/categories");
          setCategories(res.data);
          setCategory("");
        }
      }
    } catch (errors) {
      console.log(errors);
    }
  };
  const deleteCategory = async (categoryId) => {
    const res = await axios.post("/api/categories", {
      categoryId,
      delete: true,
    });
    const resCategories = await axios.get("/api/categories");
    setCategories(resCategories.data);
  };
  const goBack = () => {
    router.back();
  };
  return (
    <Layout user={user}>
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
          <button
            onClick={() => goBack()}
            className="btn btn-primary mb-2 align-self-start"
          >
            &#8592; Back
          </button>
          <h3>Categories</h3>
          <div className="d-flex gap-2 border p-3 rounded mb-4">
            {categories
              .sort((a, b) => (a.title > b.title ? 1 : -1))
              .map((category) => (
                <p
                  className="category border rounded ps-2 shadow d-flex align-items-center gap-2"
                  key={category.id}
                >
                  {category.title}
                  <span
                    onClick={() => deleteCategory(category.id)}
                    className={`${s.delete} btn btn-danger `}
                  >
                    X
                  </span>
                </p>
              ))}
          </div>
          <h4 className="">Add Category</h4>
          <div className="form-floating mb-2 d-flex flex-column">
            <input
              type="text"
              className="form-control"
              id="floatingFirstName"
              placeholder="Add category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <label htmlFor="floatingFirstName">Add category</label>
          </div>
          <button
            className=" btn btn-lg btn-primary align-self-end"
            type="submit"
          >
            Add category
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
  const resCategories = await f.getCategories(firestoreDb);
  if (user === undefined) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { categoriesList: resCategories, user: req.session.user },
  };
},
sessionOptions);
