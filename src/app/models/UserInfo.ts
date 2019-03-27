import { DataTranslator } from './DataTranslator';

export class UserInfo extends DataTranslator {
    firstName: string;
    lastName: string;

    constructor(fname: string, lname: string) {
        super();
        this.firstName = fname;
        this.lastName = lname;
    }
}
