import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuid } from 'uuid';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class MediaUploaderService {
    base64Image: string;
    fileName: string;
    mediaType: string;

    constructor(base64Image, fileName, mediaType = 'general') {
        this.base64Image = base64Image;
        this.fileName = fileName;
        this.mediaType = mediaType;
    }

    getImageType() {
        const match = this.base64Image.match(/^data:image\/(.+?);base64,/);
        return match ? match[1] : null;
    }

    async checkFilenameExists() {
        try {
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: this.fileName,
            });

            const resources = result.resources || [];

            // check if the filename exists
            return resources.some(resource => resource.public_id === this.fileName);
        } catch (error) {
            console.error(`Error checking file name: ${error.message}`);
            return false;
        }
    }

    async upload() {
        const folderName = `${process.env.APP_NAME}/${this.mediaType}`.toLowerCase().replace(/\s+/g, '_');
        let fileName = this.fileName.replace(/\s+/g, '_');

        // if the file already exists, append a UUID
        if (await this.checkFilenameExists()) {
            fileName = `${fileName}_${uuid()}`;
        }

        try {
            const uploadResult = await cloudinary.uploader.upload(this.base64Image, {
                resource_type: 'auto',
                public_id: fileName,
                folder: folderName,
            });

            return {
                success: true,
                data: { contentUrl: uploadResult.secure_url },
            };
        } catch (error) {
            console.error(`Upload error: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}

export default MediaUploaderService;
