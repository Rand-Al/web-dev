import React from "react";
import { useState } from "react";

const Dropdown = () => {
  const [categories, setCategories] = useState([]);
  const addCategories = (category) => {
    setCategories((prev) => [...prev, category]);
  };
  console.log(categories);
  return (
    <div>
      <div class="btn-group">
        <button
          type="button"
          class="btn btn-danger dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Chose category
        </button>
        <ul class="dropdown-menu">
          <li>
            <div
              onClick={(e) => addCategories(e.target.innerHTML)}
              class="dropdown-item"
              href="#"
            >
              Action
            </div>
          </li>
          <li>
            <a
              onClick={(e) => addCategories(e.target.innerHTML)}
              class="dropdown-item"
              href="#"
            >
              Another action
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="#">
              Something else here
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
