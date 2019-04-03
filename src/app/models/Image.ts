import { DataTranslator } from './DataTranslator';

export class Image extends DataTranslator {
    id: string;
    createdDate: Date;
    path: string;
    createdBy: string;
    frameIds: string[];

    constructor(id: string, createdDate: Date, path: string, createdBy: string, frameIds: string[] = null) {
        super();
        this.id = id;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.path = path;
        this.frameIds = frameIds;
    }
}
