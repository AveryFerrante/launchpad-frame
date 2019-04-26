import { DataTranslator } from './DataTranslator';

export class Image extends DataTranslator {
    id: string;
    createdDate: Date;
    downloadPath: string;
    createdBy: string;
    totalCount: number;

    constructor(id: string, createdDate: Date, downloadPath: string, createdBy: string, totalCount: number = 1) {
        super();
        this.id = id;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.downloadPath = downloadPath;
        this.totalCount = totalCount;
    }
}
