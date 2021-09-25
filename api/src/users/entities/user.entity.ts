import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { FriendRequest } from "./friend-request.entity";
import { Friendship } from "./friendship.entity";
import { Article } from "src/articles/entities/article.entity";
import { ArticleReaction } from "src/articles/entities/article-reaction.entity";
import { ArticleComment } from "src/articles/entities/article-comment.entity";
import { Notification } from "./notification.entity";
import { Skill } from "./skill.entity";
import { Education } from "./education.entity";
import { Experience } from "./experience.entity";
import { JobAlert } from "src/jobs/entities/job-alert.entity";
import { Chat } from "src/chat/entities/chat.entity";
import { Message } from "src/chat/entities/message.entity";

export enum UserRole {
    ADMIN = 'a',
    PROFESSIONAL = 'p'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({unique: true})
    email: string;

    @Column()
    phone: string;

    @Column({ select: false })
    @Exclude()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.PROFESSIONAL
    })
    role: UserRole;

    @Column({ nullable: true, default: null })
    profilePicName: string;

    @OneToMany(() => FriendRequest, friendRequest => friendRequest.sender)
    sentFriendRequests: FriendRequest[];

    @OneToMany(() => FriendRequest, friendRequest => friendRequest.receiver)
    receivedFriendRequests: FriendRequest[];

    @OneToMany(() => Friendship, friendship => friendship.user1)
    friendsAdded: Friendship[];

    @OneToMany(() => Friendship, friendship => friendship.user2)
    friendsAccepted: Friendship[];

    @OneToMany(() => Article, article => article.publisher)
    articles: Article[];

    @OneToMany(() => ArticleReaction, articleReaction => articleReaction.reactor)
    articleReactions: ArticleReaction[];

    @OneToMany(() => ArticleComment, articleComment => articleComment.commenter)
    articleComments: ArticleComment[];

    @OneToMany(() => Notification, notification => notification.receiver)
    notifications: Notification[];

    @ManyToMany(() => Skill, skill => skill.users, { eager: true })
    @JoinTable()
    skills: Skill[];

    @OneToMany(() => Education, education => education.user, { eager: true, cascade: true })
    educations: Education[];

    @OneToMany(() => Experience, experience => experience.user, { eager: true, cascade: true })
    experiences: Experience[];

    // Job alerts that user created
    @OneToMany(() => JobAlert, jobAlert => jobAlert.creator, { cascade: true })
    jobAlerts: JobAlert[];

    // Job alerts that the user applied to 
    @ManyToMany(() => JobAlert, jobAlert => jobAlert.applicants)
    @JoinTable()
    jobApplications: JobAlert[];

    @ManyToMany(() => Chat, chat => chat.users)
    chats: Chat[];

    @OneToMany(() => Message, message => message.sender)
    messages: Message[];

    connections: User[];
}