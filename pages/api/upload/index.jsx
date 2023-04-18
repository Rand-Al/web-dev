/* eslint-disable import/no-anonymous-default-export */
import { IncomingForm } from "formidable";

var mv = require("mv");

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      let oldPath = files.file.filepath;
      let newPath = `./public/uploads/${files.file.originalFilename}`;
      mv(oldPath, newPath, (err) => {});
      res.status(200).json({ fields, files });
    });
  });
};
