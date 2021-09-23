import { User } from "./user.model";

export interface Message {
    id: number;
    sentAt: Date;
    text: string;
    sender: User;
}