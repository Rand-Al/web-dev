import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(inmemoryDb.getCourses());
  }
  if (req.method === "PUT") {
    const course = req.body.course;
    const image = req.body.image;

    inmemoryDb.editCourse(course, image);
    return res.status(200).end();
  }
  if (req.method === "POST") {
    if (req.body.delete === true) {
      const courseId = req.body.courseId;
      inmemoryDb.deleteCourse(courseId);
      return res.status(200).end();
    }

    const course = req.body.course;
    const image = req.body.image;
    inmemoryDb.addCourse(course, image);
    return res.status(200).end();
  }
}
