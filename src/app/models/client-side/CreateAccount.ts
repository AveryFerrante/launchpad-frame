import { UserCredentials } from './UserCredentials';

export class CreateAccount {
    firstName: string;
    lastName: string;
    userCredentials: UserCredentials;

    constructor(fn: string, ln: string, uc: UserCredentials) {
        this.firstName = fn;
        this.lastName = ln;
        this.userCredentials = uc;
    }
}
