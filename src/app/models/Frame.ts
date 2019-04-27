import { DataTranslator } from './DataTranslator';

export class Frame extends DataTranslator {
    id: string;
    title: string;
    description: string;
    createdDate: Date;
    createdBy: string;

    constructor(id: string, title: string, description: string, createdDate: Date, createdBy: string) {
        super();
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdDate = createdDate;
        this.createdBy = createdBy;
    }
}
