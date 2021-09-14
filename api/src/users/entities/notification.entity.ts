import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    // User that the notification refers to 
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', eager: true })
    refererUser: User;

    // Entity id that the notification refers to (eg other Article, Comment etc)
    @Column({ default: 0 })
    refererEntity: number;

    @Column({ default: false })
    read: boolean;
}