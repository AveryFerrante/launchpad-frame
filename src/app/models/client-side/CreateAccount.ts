import { UserCredentials } from './UserCredentials';

export class CreateAccount {
    username: string;
    firstName: string;
    lastName: string;
    userCredentials: UserCredentials;

    constructor(un: string, fn: string, ln: string, uc: UserCredentials) {
        this.username = un;
        this.firstName = fn;
        this.lastName = ln;
        this.userCredentials = uc;
    }
}
