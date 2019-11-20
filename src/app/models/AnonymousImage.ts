import { DataTranslator } from './DataTranslator';

export class AnonymousImage extends DataTranslator {
    dateAdded: Date;
    downloadPath: string;
    token: string;

    public constructor(dateAdded: Date, downloadPath: string, token: string) {
        super();
        this.downloadPath = downloadPath;
        this.dateAdded = dateAdded;
        this.token = token;
    }
}
