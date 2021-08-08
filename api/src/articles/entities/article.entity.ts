import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column({ type: "timestamp", nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    published_at: string;

    @ManyToOne(() => User, user => user.articles, { eager: true })
    publisher: User;
}