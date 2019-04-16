import { DataTranslator } from './DataTranslator';
import { UserFrames } from './UserFrames';

export class UserInfo extends DataTranslator {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    frames: UserFrames;

    constructor(username: string, fname: string, lname: string, email: string, frames: UserFrames = null) {
        super();
        this.username = username;
        this.firstName = fname;
        this.lastName = lname;
        this.email = email;
        this.frames = frames;
    }
}
