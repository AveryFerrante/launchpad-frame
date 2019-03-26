export class CreateAccount {
    email: string;
    firstName: string;
    lastName: string;
    password: string;

    constructor(e: string, fn: string, ln: string, p: string) {
        this.email = e;
        this.firstName = fn;
        this.lastName = ln;
        this.password = p;
    }
}