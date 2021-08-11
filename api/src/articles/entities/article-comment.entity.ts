import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article.entity";

@Entity()
export class ArticleComment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.articleComments, { eager: true })
    commenter: User;

    @ManyToOne(() => Article, article => article.comments)
    article: Article;

    @Column()
    text: string;

    @CreateDateColumn()
    commented_at: Date;
}