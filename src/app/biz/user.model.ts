export class User {
    uid: string;
    fullname: string;
    username: string;
    gender: string;
    birthday: Date;
    mobile: string;
    email: string;
    remark: string;
    enabled: Boolean;
    setup_time: Date;
    update_user: string;
    update_time: Date;
    roles: any[];

    get name() {
        return this.fullname;
    }
}
