import { Article } from "./article.model";
import { User } from "./user.model";

export interface ArticleComment {
    id: number;
    commenter: User;
    article: Article;
    text: string;
    commented_at: Date;
}