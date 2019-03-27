import { DataTranslator } from './DataTranslator';

export class Frame extends DataTranslator {
    id: string;
    title: string;
    description: string;
    createdDate: Date;
    createdBy: string;
    endDate: Date;

    constructor(id: string, title: string, description: string, createdDate: Date, createdBy: string, endDate: Date) {
        super();
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.endDate = endDate;
    }
}
