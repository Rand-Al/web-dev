import fs from "fs";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      const data = fs.readFileSync(files.avatar.filepath);
      fs.writeFileSync(`./public/${files.avatar.originalFilename}`, data);
      fs.unlinkSync(files.avatar.filepath);
      res.status(201).json({
        filePath: `${req.headers.origin}/${files.avatar.originalFilename}`,
      });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
// export default function handler(req, res) {
//   if (req.method === "POST") {
//     const form = new formidable.IncomingForm();
//     form.parse(req, function (err, fields, files) {
//       const filePath = `./public/${files.avatar.originalFilename}`;
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath); // Видаляємо існуючий файл
//       }
//       const data = fs.readFileSync(files.avatar.filepath);
//       fs.writeFileSync(filePath, data);
//       fs.unlinkSync(files.avatar.filepath);
//       res.status(201).json({
//         filePath: `${req.headers.origin}/${files.avatar.originalFilename}`,
//       });
//     });
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
