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
if (!data.comments) {
  data.comments = [];
}
if (!data.userIdKey) {
  data.userId = 2;
}
if (!data.commentIdKey) {
  data.commentIdKey = 1;
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
};

export default db;
