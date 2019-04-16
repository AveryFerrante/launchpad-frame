import { DataTranslator } from './DataTranslator';

export class Username extends DataTranslator {
    username: string;
    userid: string;
    constructor(username: string, userid: string) {
        super();
        this.userid = userid;
        this.username = username;
    }
}
