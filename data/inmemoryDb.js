import fs from "fs";
import path from "path";

const filename = path.join(process.cwd(), "public/data.json");
const file = fs.readFileSync(filename);
const data = JSON.parse(file.length > 0 ? file : "{}");
if (!data.users) {
  data.users = [
    {
      id: 1,
      email: "admin@web-developer.com",
      password: "123456",
      firstName: "user1",
      lastName: "user1",
      phone: "+000000000",
      age: 18,
      role: "admin",
      isApproved: true,
      ava: "/images/ava.webp",
    },
    {
      id: 2,
      email: "user1@gmail.com",
      password: "123456",
      firstName: "user2",
      lastName: "user2",
      phone: "+0000000000",
      age: 18,
      role: "user",
      isApproved: false,
      ava: "/images/ava.webp",
    },
    {
      id: 3,
      email: "user2@gmail.com",
      password: "123456",
      firstName: "user3",
      lastName: "user3",
      phone: "+9999999999",
      age: 18,
      role: "user",
      isApproved: false,
      ava: "/images/ava.webp",
    },
    {
      id: 4,
      email: "user3@gmail.com",
      password: "123456",
      firstName: "user4",
      lastName: "user4",
      phone: "+555555555",
      age: 18,
      role: "user",
      isApproved: false,
      ava: "/images/ava.webp",
    },
  ];
}
if (!data.courses) {
  data.courses = [
    {
      id: 1,
      title: "JavaScript",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      category: ["Front end", "Back End"],
      tag: ["#JavaScript", "#BackEnd"],
      image:
        "https://placehold.jp/30/db3131/ffffff/300x150.png?text=placeholder+image",
      rating: [
        {
          value: 0,
          userId: null,
        },
      ],
    },
    {
      id: 2,
      title: "Python",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      category: ["Front end", "Back End"],
      tag: ["#JavaScript", "#BackEnd"],
      image:
        "https://placehold.jp/30/dd6699/ffffff/300x150.png?text=placeholder+image",
      rating: [
        {
          value: 0,
          userId: null,
        },
      ],
    },
    {
      id: 3,
      title: "Ruby",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      category: ["Front end", "Back End"],
      tag: ["#JavaScript", "#BackEnd"],
      image:
        "https://placehold.jp/30/d5d807/ffffff/300x150.png?text=placeholder+image",
      rating: [
        {
          value: 0,
          userId: null,
        },
      ],
    },
    {
      id: 4,
      title: "C#",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      category: ["Front end", "Back End"],
      tag: ["#JavaScript", "#BackEnd"],
      image:
        "https://placehold.jp/30/1505e9/ffffff/300x150.png?text=placeholder+image",
      rating: [
        {
          value: 0,
          userId: null,
        },
      ],
    },
  ];
}
if (!data.categories) {
  data.categories = [
    "Front end",
    "Back End",
    "Server software",
    "Application software",
    "System software",
  ];
}

if (!data.userIdKey) {
  data.userIdKey = 5;
}
if (!data.commentIdKey) {
  data.commentIdKey = 1;
}

if (!data.courseIdKey) {
  data.courseIdKey = 5;
}
if (!data.commentRatingIdKey) {
  data.commentRatingIdKey = 1;
}
fs.writeFileSync(filename, JSON.stringify(data));

const db = {
  getUsers() {
    const data = fs.readFileSync(filename);
    return JSON.parse(data).users;
  },
  editUser(user) {
    const data = JSON.parse(fs.readFileSync(filename));
    const exUser = data.users.find((u) => user.id === u.id);
    exUser.firstName = user.firstName;
    exUser.lastName = user.lastName;
    exUser.age = user.age;
    exUser.phone = user.phone;
    fs.writeFileSync(filename, JSON.stringify(data));
  },
  editAva(userId, filepath) {
    const data = JSON.parse(fs.readFileSync(filename));
    const user = data.users.find((u) => u.id === userId);
    user.ava = filepath;
    fs.writeFileSync(filename, JSON.stringify(data));
  },
  addUser(user) {
    const data = JSON.parse(fs.readFileSync(filename));
    const newUser = { ...user };
    newUser.id = data.userIdKey++;
    newUser.ava = "/images/ava.webp";
    data.users.push(newUser);

    fs.writeFileSync(filename, JSON.stringify(data));

    return newUser;
  },

  approve(userId) {
    const data = JSON.parse(fs.readFileSync(filename));
    const user = data.users.find((user) => user.id === userId);
    user.isApproved = true;

    fs.writeFileSync(filename, JSON.stringify(data));
  },

  deny(userId) {
    const data = JSON.parse(fs.readFileSync(filename));
    data.users = data.users.filter((user) => userId !== user.id);

    fs.writeFileSync(filename, JSON.stringify(data));
  },
  getCategories() {
    const data = fs.readFileSync(filename);
    return JSON.parse(data).categories;
  },
  addCategories(categories) {
    const data = JSON.parse(fs.readFileSync(filename));
    data.categories = categories;
    fs.writeFileSync(filename, JSON.stringify(data));
  },
  getComments() {
    const data = JSON.parse(fs.readFileSync(filename));
    return data.comments;
  },
  addComment(comment, userId, courseId) {
    const data = JSON.parse(fs.readFileSync(filename));
    comment.id = data.commentIdKey++;
    comment.userId = userId;
    comment.courseId = courseId;
    comment.rating = {
      likes: [],
      dislikes: [],
    };
    const user = data.users.find((user) => user.id === userId);
    if (!Array.isArray(user.comments)) {
      user.comments = [];
    }
    user.comments.push(comment);
    const course = data.courses.find((course) => course.id === courseId);
    if (!Array.isArray(course.comments)) {
      course.comments = [];
    }
    course.comments.push(comment);

    fs.writeFileSync(filename, JSON.stringify(data));
  },
  deleteComment(id, courseId, userId) {
    const data = JSON.parse(fs.readFileSync(filename));
    const user = data.users.find((user) => user.id === userId);

    user.comments = user.comments.filter((comment) => comment.id !== id);
    const course = data.courses.find((course) => course.id === courseId);

    course.comments = course.comments.filter((comment) => comment.id !== id);
    fs.writeFileSync(filename, JSON.stringify(data));
  },
  addCommentRating(rating) {
    const data = JSON.parse(fs.readFileSync(filename));
    rating.id = data.commentRatingIdKey++;
    const course = data.courses.find((course) => course.id === rating.courseId);
    const courseComments = course.comments.find(
      (comment) => comment.id === rating.commentId
    );

    if (rating.type === "like") {
      if (
        !courseComments.rating.likes.find(
          (like) => like.userId === rating.userId
        )
      ) {
        courseComments.rating.likes.push(rating);
      }
    }
    if (rating.type === "dislike") {
      if (
        !courseComments.rating.dislikes.find(
          (dislike) => dislike.userId === rating.userId
        )
      )
        courseComments.rating.dislikes.push(rating);
    }
    fs.writeFileSync(filename, JSON.stringify(data));
  },
  addCourse(course, image) {
    const data = JSON.parse(fs.readFileSync(filename));
    const newCourse = { ...course };
    newCourse.id = data.courseIdKey++;
    newCourse.image = image;
    newCourse.rating = [];
    data.courses.push(newCourse);
    fs.writeFileSync(filename, JSON.stringify(data));
  },
  getCourses() {
    const data = fs.readFileSync(filename);
    return JSON.parse(data).courses;
  },
  getCourse(id) {
    const data = fs.readFileSync(filename);
    return JSON.parse(data).courses.find((x) => x.id === id);
  },
  editCourse(course, image) {
    const data = JSON.parse(fs.readFileSync(filename));
    const exCourse = data.courses.find((c) => course.id === c.id);

    exCourse.title = course.title;
    exCourse.description = course.description;
    exCourse.category = course.category;
    if (image) {
      exCourse.image = image;
    }
    exCourse.tag = course.tag;
    fs.writeFileSync(filename, JSON.stringify(data));
  },
  deleteCourse(courseId) {
    const data = JSON.parse(fs.readFileSync(filename));
    data.courses = data.courses.filter((course) => course.id !== courseId);
    fs.writeFileSync(filename, JSON.stringify(data));
  },
  addCourseRating(rating, courseId, userId) {
    const data = JSON.parse(fs.readFileSync(filename));
    const course = data.courses.find((course) => course.id === courseId);
    const courseRating = course.rating;
    const ratingInstance = {
      value: rating,
      userId,
    };
    if (
      ratingInstance.value !== null &&
      !courseRating.find((rat) => rat.userId === userId)
    ) {
      courseRating.push(ratingInstance);
    }

    fs.writeFileSync(filename, JSON.stringify(data));
  },
  getCourseRating(courseId) {
    const data = JSON.parse(fs.readFileSync(filename));
    const course = data.courses.find((course) => course.id === courseId);
    const ratingArray = course.rating.map((rating) => rating.value);
    if (ratingArray.length > 0) {
      const rating = Math.round(
        ratingArray.reduce((a, b) => a + b) / ratingArray.length
      );
      return rating;
    }
    return 0;
  },
};

export default db;
