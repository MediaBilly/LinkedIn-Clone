import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.sentFriendRequests, { eager: true })
    sender: User;

    @ManyToOne(() => User, user => user.receivedFriendRequests, { eager: true })
    receiver: User;

    @Column({ type: "timestamp", nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    sentAt: string;
}