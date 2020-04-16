import UserDetails from "./UserDetails";

export default class User {
    id!: number;
    facebookId?: number;
    username!: string;
    email!: string;
    password!: string;
    activationToken!: string;
    active!: boolean;
    details?: UserDetails;
}