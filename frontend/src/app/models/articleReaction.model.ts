import { Article } from "./article.model";
import { User } from "./user.model";

export enum ReactionType {
    LIKE = 'li',
    CELEBRATE = 'ce',
    SUPPORT = 'su',
    LOVE = 'lo',
    INSIGHTFUL = 'in',
    CURIOUS = 'cu'
}

export interface ArticleReaction {
    id: number;
    reactor: User;
    article: Article;
    type: ReactionType;
    reactedAt: Date;
}