import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from "./message.entity";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToMany(() => User, user => user.chats, { eager: true, orphanedRowAction: 'delete' })
    @JoinTable()
    users: User[];

    @OneToMany(() => Message, message => message.chat)
    messages: Message[];

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    last_message: Date;
}