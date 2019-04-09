import { DataTranslator } from './DataTranslator';

export class Image extends DataTranslator {
    id: string;
    createdDate: Date;
    downloadPath: string;
    createdBy: string;

    constructor(id: string, createdDate: Date, downloadPath: string, createdBy: string) {
        super();
        this.id = id;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.downloadPath = downloadPath;
    }
}
