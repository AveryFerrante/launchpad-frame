import { DataTranslator } from './DataTranslator';

export class ImageFrame extends DataTranslator {
    dateAdded: Date;

    constructor(dateAdded: Date) {
        super();
        this.dateAdded = dateAdded;
    }
}
