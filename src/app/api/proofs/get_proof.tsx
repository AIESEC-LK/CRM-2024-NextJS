import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const proofsDirectory = path.join(process.cwd(), "public/proofs/");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Ensure the directory exists
      if (!fs.existsSync(proofsDirectory)) {
        fs.mkdirSync(proofsDirectory, { recursive: true });
      }

      // Read files from the directory
      const files = fs.readdirSync(proofsDirectory);
      res.status(200).json(files);
    } catch (error) {
      console.error("Error reading proofs directory:", error);
      res.status(500).json({ error: "Failed to retrieve proof files" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
