import service from "../../../data/firestore/service";
import dbFirestore from "../../../data/firestore/firestore.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res
      .status(200)
      .json(await service.getCoursesWithCategories(dbFirestore));
  }
  if (req.method === "PUT") {
    const course = req.body.course;
    const image = req.body.image;
    await service.editCourse(dbFirestore, course, image);
    return res.status(200).end();
  }
  if (req.method === "POST") {
    if (req.body.delete === true) {
      const courseId = req.body.courseId;
      await service.deleteCourse(dbFirestore, courseId);
      return res.status(200).end();
    }
    if (req.body.toCourse === true) {
      const category = req.body.category;
      const courseId = req.body.courseId;
      await service.assignCategoryToCourse(dbFirestore, courseId, category);
      return res.status(200).end();
    }
    if (req.body.delCat === true) {
      const categoryId = req.body.categoryId;
      const courseId = req.body.courseId;
      await service.deleteCategoryFromCourse(dbFirestore, courseId, categoryId);
      return res.status(200).end();
    }
    const course = req.body.course;
    const image = req.body.image;
    await service.addCourse(dbFirestore, course, image);
    return res.status(200).end();
  }
}
