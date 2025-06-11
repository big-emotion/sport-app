import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { Request } from "express";
import { BadRequestError } from "../utils/errors";

// Types de fichiers autorisés
const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  // Vidéos
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

// Taille maximale des fichiers (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique avec l'extension d'origine
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// Filtre des fichiers
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(
      new BadRequestError(
        `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`
      )
    );
    return;
  }
  cb(null, true);
};

// Configuration de multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
