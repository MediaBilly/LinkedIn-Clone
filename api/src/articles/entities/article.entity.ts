import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArticleComment } from "./article-comment.entity";
import { ArticleImage } from "./article-image.entity";
import { ArticleReaction } from "./article-reaction.entity";
import { ArticleVideo } from "./article-video.entity";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @CreateDateColumn()
    published_at: Date;

    @ManyToOne(() => User, user => user.articles, { eager: true })
    publisher: User;

    @OneToMany(() => ArticleReaction, reaction => reaction.article, { eager: true })
    reactions: ArticleReaction[];

    @OneToMany(() => ArticleComment, comment => comment.article, { eager: true })
    comments: ArticleComment[];

    @OneToMany(() => ArticleImage, articleImage => articleImage.article, { eager: true })
    images: ArticleImage[];

    @OneToMany(() => ArticleVideo, articleVideo => articleVideo.article, { eager: true })
    videos: ArticleVideo[];
}