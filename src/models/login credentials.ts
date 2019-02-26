export class LoginCredentials {
    private email: string;
    private password: string;
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    get Email(): string { return this.email; }
    get Password(): string { return this.password; }
}
