import multer from 'multer';
import path from 'path';

// Setup storage for multer
const storage = multer.memoryStorage(); // This stores the file in memory, which is needed for Cloudinary

// Initialize multer
const singleUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/; // Allowed file types
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPEG, JPG, and PNG are allowed."));
        }
    }
}).single("file"); // Expecting the file to be sent under the key 'file'

// Export the multer middleware
export {singleUpload};


