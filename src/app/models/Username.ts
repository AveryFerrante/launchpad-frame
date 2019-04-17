import { DataTranslator } from './DataTranslator';

export class Username extends DataTranslator {
    username: string;
    userid: string;
    usernametrimmed: string;
    constructor(username: string, userid: string) {
        super();
        this.userid = userid;
        this.username = username;
        this.usernametrimmed = username.toLowerCase().trim();
    }
}
