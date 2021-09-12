import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum NotificationType {
    ALERT = 'al',
    ACCEPTED_FRIEND_REQUEST = 'ac',
    ARTICLE_REACTION = 're',
    ARTICLE_COMMENT = 'cm'
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.ALERT
    })
    type: NotificationType;

    @CreateDateColumn()
    receivedAt: Date;

    @ManyToOne(() => User, user => user.notifications, { eager: true, onDelete: 'CASCADE' })
    receiver: User;

    // Entity id that the notification refers to (eg other User, Article, Comment etc)
    @Column({ default: 0 })
    referer: number;

    @Column({ default: false })
    read: boolean;
}