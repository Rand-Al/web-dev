const crypto = require("crypto");
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const data = {
  getUsers: async (db) => {
    const usersCol = collection(db, "users");
    const usersSnapshot = await getDocs(usersCol);
    const usersList = usersSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return usersList;
  },
  editUser: async (db, user) => {
    const userRef = doc(db, "users", `${user.id}`);
    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      phone: user.phone,
    };
    try {
      await setDoc(userRef, data, { merge: true });
      console.log("User has been updated successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  editAva: async (db, userId, filepath) => {
    const userRef = doc(db, "users", `${userId}`);
    const data = {
      ava: filepath,
    };
    try {
      await setDoc(userRef, data, { merge: true });
      console.log("User avatar has been updated successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  addUser: async (db, user) => {
    const usersRef = collection(db, "users");
    const salt = "dove";
    const hashPassword = crypto
      .createHash("sha256")
      .update(user.password + salt)
      .digest("hex");
    const data = {
      email: user.email,
      password: hashPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      phone: user.phone,
      role: "user",
      isApproved: false,
      ava: "/images/ava.webp",
    };
    try {
      addDoc(usersRef, data);
      console.log("User has been added successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  approveUser: async (db, userId) => {
    const userRef = doc(db, "users", `${userId}`);
    const data = {
      isApproved: true,
    };
    try {
      await setDoc(userRef, data, { merge: true });
      console.log("User approved!");
    } catch (errors) {
      console.log(errors);
    }
  },
  deleteUser: async (db, userId) => {
    const userRef = doc(db, "users", `${userId}`);
    try {
      await deleteDoc(userRef);
      console.log("User has been deleted successfully.");
    } catch (errors) {
      console.log(errors);
    }
  },

  getCategories: async (db) => {
    const categoriesCol = collection(db, "categories");
    const categoriesSnapshot = await getDocs(categoriesCol);
    const categoriesList = categoriesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return categoriesList;
  },
  addCategory: async (db, category) => {
    const categoriesRef = collection(db, "categories");
    const data = {
      title: category,
    };
    try {
      addDoc(categoriesRef, data);
      console.log("Category has been added successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  assignCategoryToCourse: async (db, courseId, category) => {
    const categoriesCoursesRef = collection(db, "coursesCategories");
    const data = {
      courseId,
      categoryId: category.id,
    };
    try {
      addDoc(categoriesCoursesRef, data);
      console.log("Category has been assigned to course successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  deleteCategoryFromCourse: async (db, courseId, categoryId) => {
    const categoriesCoursesRef = collection(db, "coursesCategories");
    const categoriesCoursesQuery = query(
      categoriesCoursesRef,
      where("categoryId", "==", categoryId),
      where("courseId", "==", courseId)
    );
    const categoriesCoursesSnapshot = await getDocs(categoriesCoursesQuery);
    const categoriesCoursesData = categoriesCoursesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const docCategoriesCoursesRef = doc(
      db,
      "coursesCategories",
      categoriesCoursesData[0].id
    );
    try {
      deleteDoc(docCategoriesCoursesRef);
      console.log("Category has been removed from course successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  deleteCategory: async (db, categoryId) => {
    const categoryRef = doc(db, "categories", `${categoryId}`);
    try {
      await deleteDoc(categoryRef);
      console.log("Category has been deleted successfully.");
    } catch (errors) {
      console.log(errors);
    }
  },

  getCourseComments: async (db, courseId) => {
    const commentsCol = collection(db, "courses", `${courseId}`, "comments");
    const commentsSnapshot = await getDocs(commentsCol);
    const commentsList = commentsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const commentsWithLikes = [];
    for (let comment of commentsList) {
      const likesCol = collection(
        db,
        "courses",
        `${courseId}`,
        "comments",
        comment.id,
        "likes"
      );
      const likesSnapshot = await getDocs(likesCol);
      const likesList = likesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const dislikesCol = collection(
        db,
        "courses",
        `${courseId}`,
        "comments",
        comment.id,
        "dislikes"
      );
      const dislikesSnapshot = await getDocs(dislikesCol);
      const dislikesList = dislikesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      commentsWithLikes.push({
        ...comment,
        likes: [...likesList],
        dislikes: [...dislikesList],
      });
    }
    return commentsWithLikes;
  },
  addComment: async (db, comment, userId, courseId) => {
    const commentsRef = collection(db, "courses", `${courseId}`, "comments");
    const date = new Date();
    const options = {
      month: "long",
      day: "numeric",
      timezone: "UTC",
      hour: "numeric",
      minute: "numeric",
    };
    const sendDate = date.toLocaleString("en", options);

    console.log();
    const data = {
      body: comment,
      userId,
      courseId,
      createdAt: sendDate,
    };
    console.log(data.createdAt);
    try {
      await addDoc(commentsRef, data);
      console.log("Comment has been added successfully");
    } catch (error) {
      console.log(error);
    }
  },
  addCommentRating: async (db, rating) => {
    const data = rating;
    const likesRef = collection(
      db,
      "courses",
      `${rating.courseId}`,
      "comments",
      `${rating.commentId}`,
      "likes"
    );
    const likesSnapshot = await getDocs(likesRef);
    const likesList = likesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const dislikesRef = collection(
      db,
      "courses",
      `${rating.courseId}`,
      "comments",
      `${rating.commentId}`,
      "dislikes"
    );
    const dislikesSnapshot = await getDocs(dislikesRef);
    const dislikesList = dislikesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    // const processData = {
    //   like: [likesList, dislikesList],
    //   dislike: [dislikesList, likesList],
    // };
    // const toggleRating = (rating, processData) => {
    //   addRating(rating, processData);
    //   removeRate(rating, processData);
    // };
    // const addRating = (rating, processData) => {
    //   if (processData[rating.type][0].find((r) => r.userId === rating.userId)) {
    //     const rateRef = collection(
    //       db,
    //       "courses",
    //       `${rating.courseId}`,
    //       "comments",
    //       `${rating.commentId}`,
    //       `${rating.type}s`
    //     );
    //     try {
    //       addDoc(rateRef, rating);
    //       console.log("Document has been added successfully");
    //     } catch (errors) {
    //       console.log(errors);
    //     }
    //   }
    // };
    // const removeRate = async (rating, processData) => {
    //   if (processData[rating.type][0].find((r) => r.userId === rating.userId)) {
    //     const rate = processData[rating.type][0].find(
    //       (d) => d.userId === rating.userId
    //     );
    //     console.log(processData);
    //     const rateRef = doc(
    //       db,
    //       "courses",
    //       `${rating.courseId}`,
    //       "comments",
    //       `${rating.commentId}`,
    //       `${rating.type}s`,
    //       `${rate.id}`
    //     );
    //     try {
    //       await deleteDoc(rateRef);
    //       console.log("Entire Document has been deleted successfully.");
    //     } catch (errors) {
    //       console.log(errors);
    //     }
    //   }
    // };
    // toggleRating(rating, processData);
    if (
      rating.type === "like" &&
      !likesList.find((l) => l.userId === rating.userId)
    ) {
      try {
        addDoc(likesRef, data);
        console.log("Like has been added to comment successfully");
      } catch (errors) {
        console.log(errors);
      }
    }
    if (dislikesList.find((d) => d.userId === rating.userId)) {
      const rate = dislikesList.find((d) => d.userId === rating.userId);
      const dislikeRef = doc(
        db,
        "courses",
        `${rating.courseId}`,
        "comments",
        `${rating.commentId}`,
        "dislikes",
        `${rate.id}`
      );
      try {
        await deleteDoc(dislikeRef);
        console.log("Dislike has been removed from comment successfully.");
      } catch (errors) {
        console.log(errors);
      }
    }

    if (
      rating.type === "dislike" &&
      !dislikesList.find((d) => d.userId === rating.userId)
    ) {
      try {
        addDoc(dislikesRef, data);
        console.log("Dislike has been added to comment successfully");
      } catch (errors) {
        console.log(errors);
      }
    }
    if (likesList.find((l) => l.userId === rating.userId)) {
      const rate = likesList.find((d) => d.userId === rating.userId);
      const likeRef = doc(
        db,
        "courses",
        `${rating.courseId}`,
        "comments",
        `${rating.commentId}`,
        "likes",
        `${rate.id}`
      );
      try {
        await deleteDoc(likeRef);
        console.log(
          "Like Document has been deleted from comment successfully."
        );
      } catch (errors) {
        console.log(errors);
      }
    }
  },
  deleteComment: async (db, commentId, courseId) => {
    const commentRef = doc(
      db,
      "courses",
      `${courseId}`,
      "comments",
      `${commentId}`
    );
    try {
      await deleteDoc(commentRef);
      console.log("Comment has been deleted successfully.");
    } catch (errors) {
      console.log(errors);
    }
  },

  addCourse: async (db, course, image) => {
    const coursesRef = collection(db, "courses");
    const data = {
      title: course.title,
      description: course.description,
      tags: course.tags,
    };
    if (image) {
      data.image = image;
    } else if (!image) {
      data.image = "/images/tech/placeholderCourse.jpg";
    }

    try {
      addDoc(coursesRef, data);
      console.log("Course has been created successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  getCourses: async (db) => {
    const coursesCol = collection(db, "courses");
    const coursesList = [];
    const unsubscribe = onSnapshot(coursesCol, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        coursesList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    unsubscribe();
    return coursesList;
  },
  getCoursesWithCategories: async (db) => {
    const coursesCol = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCol);
    const coursesList = coursesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const categoriesCol = collection(db, "categories");
    const categoriesSnapshot = await getDocs(categoriesCol);
    const categoryData = categoriesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const coursesWithCategories = [];

    for (let course of coursesList) {
      const categories = [];
      const junctionRef = collection(db, "coursesCategories");
      const junctionQuery = query(
        junctionRef,
        where("courseId", "==", course.id)
      );
      const junctionSnapshot = await getDocs(junctionQuery);
      junctionSnapshot.forEach((doc) => {
        const categoryId = doc.data().categoryId;
        // Find the category with the matching ID and add it to the courseCategories array
        const category = categoryData.filter((cat) => cat.id === categoryId);
        if (category.length) {
          categories.push(category);
        }
      });

      coursesWithCategories.push({
        ...course,
        categories: categories.flat(Infinity),
      });
    }
    return coursesWithCategories;
  },
  getCourse: async (db, courseId) => {
    const courseRef = doc(db, "courses", `${courseId}`);
    const courseDoc = await getDoc(courseRef);
    const courseData = { ...courseDoc.data(), id: courseDoc.id };
    return courseData;
  },
  editCourse: async (db, course, image) => {
    const courseRef = doc(db, "courses", `${course.id}`);
    const data = {
      title: course.title,
      description: course.description,
      tags: course.tags,
    };
    if (image) {
      data.image = `/images/uploads${image}`;
    }
    try {
      await setDoc(courseRef, data, { merge: true });
      console.log("Course has been updated successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  deleteCourse: async (db, courseId) => {
    const courseRef = doc(db, "courses", `${courseId}`);
    try {
      await deleteDoc(courseRef);
      console.log("Course has been deleted successfully.");
    } catch (errors) {
      console.log(errors);
    }
  },

  addCourseRating: async (db, value, courseId, userId) => {
    const ratingCol = collection(db, "courses", `${courseId}`, "rating");
    const data = { value, userId };
    try {
      addDoc(ratingCol, data);
      console.log("Rating has been added successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  getCourseRating: async (db, courseId) => {
    const ratingCol = collection(db, "courses", `${courseId}`, "rating");
    const ratingSnapshot = await getDocs(ratingCol);
    const ratingList = ratingSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const ratingArray = ratingList.map((rating) => rating.value);
    if (ratingArray.length > 0) {
      const rating = Math.floor(
        ratingArray.reduce((a, b) => Number(a) + Number(b)) / ratingArray.length
      );
      return rating;
    }
    return 0;
  },
};

export default data;
