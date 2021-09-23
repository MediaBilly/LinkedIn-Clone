import { User } from "./user.model";

export interface Chat {
    id: number;
    users: User[];
    last_message: Date;
}