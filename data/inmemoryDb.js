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
  data.courseIdKey = 2;
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
  addUser(user) {
    const data = JSON.parse(fs.readFileSync(filename));
    const newUser = { ...user };
    newUser.id = data.userIdKey++;
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
  addCategory(category) {
    const data = JSON.parse(fs.readFileSync(filename));
    data.categories.push(category);
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
    console.log(id, userId, courseId);
    const data = JSON.parse(fs.readFileSync(filename));
    const user = data.users.find((user) => user.id === userId);
    console.log(user);
    user.comments = user.comments.filter((comment) => comment.id !== id);
    const course = data.courses.find((course) => course.id === courseId);
    console.log(course);
    course.comments = course.comments.filter((comment) => comment.id !== id);
    fs.writeFileSync(filename, JSON.stringify(data));
  },
  addCourse(course) {
    const data = JSON.parse(fs.readFileSync(filename));
    const newCourse = { ...course };
    newCourse.id = course.courseIdKey++;
    data.courses.push(newCourse);
    fs.writeFileSync(filename, JSON.stringify(data));
  },
  getCourses() {
    const data = fs.readFileSync(filename);
    return JSON.parse(data).courses;
  },
  editCourse(course) {
    const data = JSON.parse(fs.readFileSync(filename));
    const exCourse = data.courses.find((c) => course.id === c.id);
    exCourse.title = course.title;
    exCourse.description = course.description;
    exCourse.category = course.category;
    exCourse.image = course.image;
    exCourse.tag = course.tag;
    fs.writeFileSync(filename, JSON.stringify(data));
  },
};

export default db;
