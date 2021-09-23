import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    sentAt: Date;

    @Column()
    text: string;

    @ManyToOne(() => Chat, chat => chat.messages, { onDelete: 'CASCADE' })
    chat: Chat;

    @ManyToOne(() => User, user => user.messages, { eager: true, onDelete: 'SET NULL' })
    sender: User;
}