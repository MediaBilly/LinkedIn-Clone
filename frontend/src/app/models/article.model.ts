import { ArticleComment } from "./articleComment.model";
import { ArticleImage } from "./articleImage.model";
import { ArticleReaction } from "./articleReaction.model";
import { ArticleVideo } from "./articleVideo.model";
import { User } from "./user.model";

export interface Article {
    id: number;
    text: string;
    published_at: Date;
    publisher: User;
    reactions: ArticleReaction[];
    comments: ArticleComment[];
    images: ArticleImage[];
    videos: ArticleVideo[];
}