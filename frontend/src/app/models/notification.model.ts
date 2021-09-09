import { User } from "./user.model";

export enum NotificationType {
    ALERT = 'al',
    ACCEPTED_FRIEND_REQUEST = 'ac',
    ARTICLE_REACTION = 're',
    ARTICLE_COMMENT = 'cm'
}

export interface Notification {
    id: number;
    type: NotificationType;
    receivedAt: Date;
    receiver: User;
    referer: number;
    read: boolean;
}