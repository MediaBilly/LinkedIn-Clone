import { User } from "./user.model";

export interface FriendRequest {
    id: number;
    sentAt: Date;
    sender: User;
    receiver: User;
}