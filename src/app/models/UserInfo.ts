import { DataTranslator } from './DataTranslator';
import { UserFrames } from './UserFrames';

export class UserInfo extends DataTranslator {
    firstName: string;
    lastName: string;
    email: string;
    frames: UserFrames;

    constructor(fname: string, lname: string, email: string, frames: UserFrames = null) {
        super();
        this.firstName = fname;
        this.lastName = lname;
        this.email = email;
        this.frames = frames;
    }
}
