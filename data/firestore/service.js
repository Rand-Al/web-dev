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
  arrayRemove,
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
      console.log("Entire Document has been updated successfully");
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
      console.log("Entire Document has been updated successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  addUser: async (db, user) => {
    const usersRef = collection(db, "users");
    const data = {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      phone: user.phone,
      role: "user",
      isApproved: false,
    };
    try {
      addDoc(usersRef, data);
      console.log("Document has been added successfully");
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
      console.log("Entire Document has been deleted successfully.");
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
      console.log("Document has been added successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  deleteCategory: async (db, categoryId) => {
    const categoryRef = doc(db, "categories", `${categoryId}`);
    try {
      await deleteDoc(categoryRef);
      console.log("Entire Document has been deleted successfully.");
    } catch (errors) {
      console.log(errors);
    }
  },
  addComment: async (db, comment, userId, courseId) => {
    const courseRef = doc(db, "courses", `${courseId}`);
    const data = {
      id: uuidv4(),
      body: comment,
      userId,
      courseId,
      rating: {
        likes: [],
        dislikes: [],
      },
    };
    try {
      await updateDoc(courseRef, {
        comments: arrayUnion(data),
      });
      console.log("Document has been added successfully");
    } catch (error) {
      console.log(error);
    }
  },
  addCommentRating: async (db, rating) => {
    const ratingWithId = {
      ...rating,
      id: uuidv4(),
    };
    const courseRef = doc(db, "courses", `${rating.courseId}`);
    const courseDoc = await getDoc(courseRef);
    const courseData = courseDoc.data();
    let courseComments = courseData.comments;
    const indexOfExComment = courseComments.findIndex(
      (c) => c.id === rating.commentId
    );
    const exComment = courseComments[indexOfExComment];

    const likesArray = exComment.rating.likes;
    const indexOfLike = likesArray.findIndex(
      (like) => like.userId === rating.userId
    );

    const dislikesArray = exComment.rating.dislikes;
    const indexOfDislike = dislikesArray.findIndex(
      (dislike) => dislike.userId === rating.userId
    );

    let newCommentsObject = courseComments.reduce(
      (a, v) => ({ ...a, [v.id]: v }),
      {} //? Revert array to object with comment id key
    );
    if (indexOfLike === -1 && rating.type === "like") {
      newCommentsObject[rating.commentId].rating.likes = [
        ...newCommentsObject[rating.commentId].rating.likes,
        ratingWithId,
      ];

      try {
        await updateDoc(courseRef, {
          comments: Object.values(newCommentsObject),
        });
        console.log("Document has been added successfully");
      } catch (error) {
        console.log(error);
      }
    } else if (indexOfDislike === -1 && rating.type === "dislike") {
      newCommentsObject[rating.commentId].rating.dislikes = [
        ...newCommentsObject[rating.commentId].rating.dislikes,
        ratingWithId,
      ];
      try {
        await updateDoc(courseRef, {
          comments: Object.values(newCommentsObject),
        });
        console.log("Document has been added successfully");
      } catch (error) {
        console.log(error);
      }
    }
  },
  deleteComment: async (db, id, courseId, userId) => {
    const courseRef = doc(db, "courses", `${courseId}`);
    const courseDoc = await getDoc(courseRef);
    const courseData = courseDoc.data();
    const index = courseData.comments.findIndex((comment) => comment.id === id);
    console.log(index);
    try {
      if (index !== -1) {
        // If user has already rated the course, update the rating instance
        await updateDoc(courseRef, {
          comments: arrayRemove(courseData.comments[index]),
        });
      }
      console.log(`Comment deleted successfully`);
    } catch (errors) {
      console.log(errors);
    }
  },
  addCourse: async (db, course, image) => {
    console.log(course);
    const coursesRef = collection(db, "courses");
    const data = {
      title: course.title,
      description: course.description,
      category: course.category,
      tag: course.tag,
      comments: [],
      image: image,
      rating: [],
    };

    try {
      addDoc(coursesRef, data);
      console.log("Document has been added successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  getCourses: async (db) => {
    const coursesCol = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCol);
    const coursesList = coursesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return coursesList;
  },
  getCourse: async (db, courseId) => {
    const courseRef = doc(db, "courses", `${courseId}`);
    const courseDoc = await getDoc(courseRef);
    const courseData = { ...courseDoc.data(), id: courseDoc.id };
    return courseData;
  },
  editCourse: async (db, course, image) => {
    const courseRef = doc(db, "courses", `${course.id}`);
    if (!!image) {
      image = "/123.jpg";
    }
    const data = {
      title: course.title,
      description: course.description,
      category: course.category,
      tag: course.tag,
    };
    if (image) {
      data.image = image;
    }
    try {
      await setDoc(courseRef, data, { merge: true });
      console.log("Entire Document has been updated successfully");
    } catch (errors) {
      console.log(errors);
    }
  },
  deleteCourse: async (db, courseId) => {
    const courseRef = doc(db, "courses", `${courseId}`);
    try {
      await deleteDoc(courseRef);
      console.log("Entire Document has been deleted successfully.");
    } catch (errors) {
      console.log(errors);
    }
  },
  addCourseRating: async (db, value, courseId, userId) => {
    const courseRef = doc(db, "courses", `${courseId}`);
    const data = { value, userId };
    const courseDoc = await getDoc(courseRef);
    const courseData = courseDoc.data();
    const index = courseData.rating.findIndex((rat) => rat.userId === userId); //! Знаходимо індекс елементу, в якого userId === вхідному userId для того, щоб за індексом нижче по коду видалити елемент з масиву за допомогою arrayRemove(), якщо такий є.

    try {
      if (index !== -1) {
        //! Після видалення або якщо такого елементу ще немає в масиві, то додати його за допомогою arrayUnion()
        // If user has already rated the course, update the rating instance
        await updateDoc(courseRef, {
          rating: arrayRemove(courseData.rating[index]),
        });
      }
      await updateDoc(courseRef, {
        rating: arrayUnion(data),
      });
      console.log("Document has been added successfully");
    } catch (error) {
      console.log(error);
    }
  },
  getCourseRating: async (db, courseId) => {
    const courseRef = doc(db, "courses", `${courseId}`);
    const courseDoc = await getDoc(courseRef);
    const courseData = courseDoc.data();

    const ratingArray = courseData.rating.map((rating) => rating.value);
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
