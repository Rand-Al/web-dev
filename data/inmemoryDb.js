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
      firstName: "Admin",
      lastName: "Admin",
      phone: "+380555443322",
      age: 18,
      role: "admin",
      isApproved: true,
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
if (!data.comments) {
  data.comments = [];
}
if (!data.userIdKey) {
  data.userId = 2;
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

  addUser(user) {
    const data = JSON.parse(fs.readFileSync(filename));

    const newUser = { ...user };
    newUser.id = data.userId++;
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
    data.users = data.users.find((user) => user.id !== userId);

    fs.writeFileSync(filename, JSON.stringify(data));
  },

  addComment(comment, userId, courseId) {
    const data = JSON.parse(fs.readFileSync(filename));
    comment.id = data.commentIdKey++;
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
  addCourse(course) {
    const data = JSON.parse(fs.readFileSync(filename));
    const newCourse = { ...course };
    newCourse.id = course.courseIdKey++;
    data.courses.push(newCourse);
  },
  getCourses() {
    const data = fs.readFileSync(filename);
    return JSON.parse(data).courses;
  },
};

export default db;
