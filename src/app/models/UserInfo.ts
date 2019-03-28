import { DataTranslator } from './DataTranslator';

export class UserInfo extends DataTranslator {
    firstName: string;
    lastName: string;
    ownedFrames: string[];

    constructor(fname: string, lname: string, ownedFrames: string[] = []) {
        super();
        this.firstName = fname;
        this.lastName = lname;
        this.ownedFrames = ownedFrames;
    }
}
