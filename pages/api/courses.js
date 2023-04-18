import inmemoryDb from "@/data/inmemoryDb";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(inmemoryDb.getCourses());
  }
  if (req.method === "PUT") {
    const course = req.body;
    inmemoryDb.editCourse(course);
    return res.status(200).end();
  }
}
