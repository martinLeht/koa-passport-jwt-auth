export default class User {
    id!: number;
    facebook_id?: number;
    username!: string;
    email!: string;
    password!: string;
    activationToken!: string;
    active!: boolean;
}