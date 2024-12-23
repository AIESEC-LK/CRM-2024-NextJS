import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import fs from "fs";
import path from "path";

const proofsDirectory = path.join(process.cwd(), "public/proofs/");

// Set up Multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Ensure the directory exists
      if (!fs.existsSync(proofsDirectory)) {
        fs.mkdirSync(proofsDirectory, { recursive: true });
      }
      cb(null, proofsDirectory);
    },
    filename: (req, file, cb) => {
      // Use the provided filename from the query or body
      const { filename } = req.body;
      cb(null, filename);
    },
  }),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    upload.single("file")(req as any, res as any, (err: any) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(500).json({ error: "Failed to upload file" });
      }
      res.status(200).json({ message: "File uploaded successfully" });
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;

export const config = {
  api: {
    bodyParser: false, // Disable built-in bodyParser to use multer
  },
};
