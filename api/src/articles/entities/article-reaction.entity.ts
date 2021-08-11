import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReactionType } from "../enums/reaction-type.enum";
import { Article } from "./article.entity";

@Entity()
export class ArticleReaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.articleReactions, { eager: true })
    reactor: User;

    @ManyToOne(() => Article, article => article.reactions)
    article: Article;

    @Column({
        type: 'enum',
        enum: ReactionType,
        default: ReactionType.LIKE
    })
    type: ReactionType;

    @CreateDateColumn()
    reacted_at: Date;
}