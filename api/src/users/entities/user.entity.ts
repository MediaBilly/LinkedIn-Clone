import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { FriendRequest } from "./friend-request.entity";
import { Friendship } from "./friendship.entity";

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

    @Exclude({ toPlainOnly: true })
    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.PROFESSIONAL
    })
    role: UserRole;

    @OneToMany(() => FriendRequest, friendRequest => friendRequest.sender)
    sentFriendRequests: FriendRequest[];

    @OneToMany(() => FriendRequest, friendRequest => friendRequest.receiver)
    receivedFriendRequests: FriendRequest[];

    // @ManyToMany(() => User, user => user.friends)
    // @JoinTable()
    // friends: User[];

    @OneToMany(() => Friendship, friendship => friendship.user1)
    friendsAdded: Friendship[];

    @OneToMany(() => Friendship, friendship => friendship.user2)
    friendsAccepted: Friendship[];
}