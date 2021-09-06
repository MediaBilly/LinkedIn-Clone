import { User } from "./user.model";

export interface LoggedInUser {
    access_token: string;
    user: User;
}