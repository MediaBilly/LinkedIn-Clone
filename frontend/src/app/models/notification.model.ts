import { User } from "./user.model";

export enum NotificationType {
    ALERT = 'al',
    ACCEPTED_FRIEND_REQUEST = 'ac',
    ARTICLE_REACTION = 're',
    ARTICLE_COMMENT = 'cm',
    JOB_APPLICATION_ACCEPTED = 'ja',
    JOB_APPLICATION_DECLINED = 'jd'
}

export interface Notification {
    id: number;
    type: NotificationType;
    receivedAt: Date;
    receiver: User;
    refererUser: User;
    refererEntity: number;
    read: boolean;
}