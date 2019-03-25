export class UserInfo {
    FirstName: string;
    LastName: string;
    UserId: string;

    constructor(fname: string, lname: string, uid: string) {
        this.FirstName = fname;
        this.LastName = lname;
        this.UserId = uid;
    }

    public getData(): object {
        const result = {};
        Object.keys(this).map(key => result[key] = this[key]);
        return result;
    }
}
