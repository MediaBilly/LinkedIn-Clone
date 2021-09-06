import { User } from "./user.model";

export interface RegisteredUser {
    access_token: string;
    new_user: User;
}