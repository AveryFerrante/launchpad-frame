import { DataTranslator } from './DataTranslator';


export class FrameImage extends DataTranslator {
    id: string;
    downloadPath: string;
    imageId: string;
    ownerId: string;
    dateAdded: Date;
    addedBy: string;
    constructor(id: string, downloadPath: string, imageId: string, ownerId: string, dateAdded: Date, addedBy: string) {
        super();
        this.id = id;
        this.downloadPath = downloadPath;
        this.imageId = imageId;
        this.ownerId = ownerId;
        this.dateAdded = dateAdded;
        this.addedBy = addedBy;
    }
}

