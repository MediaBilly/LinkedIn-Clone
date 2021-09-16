import { fromFile } from "file-type";
import { diskStorage } from "multer";
import { join } from "path";
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

export const articleImagesRoot: string = './storage/images/article_images';
const validImageExtensions: string[] = ['.jpeg', '.jpg', '.png'];
const validImageMimeTypes: string[] = ['image/png', 'image/jpeg', 'image/jpg'];

export const articleVideosRoot: string = './storage/videos/article_videos';
const validVideoExtensions: string[] = ['.mp4', '.m4a', '.m4p', '.m4b', '.m4r', '.m4v'];
const validVideoMimeTypes: string[] = ['video/mp4'];

// IMAGE FUNCTIONS

export const checkImageType = (imgName) : Promise<boolean> => {
    return fromFile(getImageLocation(imgName)).then((fileInfo) => {
        return fileInfo && validImageMimeTypes.includes(fileInfo.mime);
    });
}

export const getImageLocation = (imageName?: string): string => {
    return imageName ? join(process.cwd(), articleImagesRoot, imageName) : join(process.cwd(), articleImagesRoot);
}


// VIDEO FUNCTIONS


export const checkVideoType = (videoName) : Promise<boolean> => {
    return fromFile(getVideoLocation(videoName)).then((fileInfo) => {
        return fileInfo && validVideoMimeTypes.includes(fileInfo.mime);
    });
}

export const getVideoLocation = (videoName?: string): string => {
    return videoName ? join(process.cwd(), articleVideosRoot, videoName) : join(process.cwd(), articleVideosRoot);
}

// ARTICLE MEDIA OPTIONS

export const articleMediaOptions = {
    storage: diskStorage({
        destination: (req, file, callback) => {
            const extension = path.extname(file.originalname);
            if (file.fieldname === 'image' && validImageExtensions.includes(extension.toLowerCase())) {
                callback(null, articleImagesRoot);
            } else if (file.fieldname === 'video' && validVideoExtensions.includes(extension.toLowerCase())) {
                callback(null, articleVideosRoot);
            } else {
                callback(null, './storage');
            }
        },
        filename: (req, file, callback) => {
            const filename: string = uuidv4();
            const extension = path.extname(file.originalname);
            callback(null, filename + extension);
        },
    }),
    fileFilter: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        if (file.fieldname === 'image' && validImageExtensions.includes(extension.toLowerCase())) {
            callback(null, validImageMimeTypes.includes(file.mimetype));
        } else if (file.fieldname === 'video' && validVideoExtensions.includes(extension.toLowerCase())) {
            callback(null, validVideoMimeTypes.includes(file.mimetype));
        } else {
            callback(null, false);
        }
    },
}
