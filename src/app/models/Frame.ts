import { DataTranslator } from './DataTranslator';

export class Frame extends DataTranslator {
    id: string;
    title: string;
    description: string;
    createdDate: Date;
    createdBy: string;
    endDate: Date;
    imagePaths: string[];
    imageIds: string[];

    constructor(id: string, title: string, description: string, createdDate: Date, createdBy: string, endDate: Date,
        imagePaths: string[] = null, imageIds: string[] = null) {
        super();
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdDate = createdDate;
        this.endDate = endDate;
        this.createdBy = createdBy;
        this.imagePaths = imagePaths;
        this.imageIds = imageIds;
    }
}
