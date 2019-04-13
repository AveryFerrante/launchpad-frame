import { DataTranslator } from './DataTranslator';


export class FrameImage extends DataTranslator {
    id: string;
    downloadPath: string;
    imageId: string;
    ownerId: string;
    constructor(id: string, downloadPath: string, imageId: string, ownerId: string) {
        super();
        this.id = id;
        this.downloadPath = downloadPath;
        this.imageId = imageId;
        this.ownerId = ownerId;
    }
}

