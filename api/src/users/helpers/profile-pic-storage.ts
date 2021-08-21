import { fromFile } from "file-type";
import { diskStorage } from "multer";
import { join } from "path";
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

export const profilePicsRoot: string = './storage/images/profile_pics';

const validExtensions: string[] = ['.jpeg', '.jpg', '.png'];

const validMimeTypes: string[] = ['image/png', 'image/jpeg', 'image/jpg'];

export const profilePicStorage = {
    storage: diskStorage({
        destination: profilePicsRoot,
        filename: (req, file, callback) => {
            const filename: string = uuidv4();
            const extension = path.extname(file.originalname);
            callback(null, filename + extension);
        }
    }),
    fileFilter: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        validExtensions.includes(extension.toLowerCase()) && validMimeTypes.includes(file.mimetype) ? callback(null, true) : callback(null, false);
    }
}

export const checkImageType = (imgName) : Promise<boolean> => {
    return fromFile(join(process.cwd(), profilePicsRoot, imgName)).then((fileInfo) => {
        return fileInfo && validMimeTypes.includes(fileInfo.mime);
    });
}