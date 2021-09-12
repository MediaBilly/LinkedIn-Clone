import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsQuery } from 'src/helpers/existsQuery';
import { Friendship } from 'src/users/entities/friendship.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { AddArticleCommentDto } from './dto/add-article-comment.dto';
import { AddArticleReactionDto } from './dto/add-article-reaction.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleCommentDto } from './dto/update-article-comment.dto';
import { UpdateArticleReactionDto } from './dto/update-article-reaction.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleComment } from './entities/article-comment.entity';
import { ArticleReaction } from './entities/article-reaction.entity';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article) private articlesRepository: Repository<Article>,
        @InjectRepository(ArticleReaction) private articleReactionsRepository: Repository<ArticleReaction>,
        @InjectRepository(ArticleComment) private articleCommentsRepository: Repository<ArticleComment>,
        @InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>,
        private usersService: UsersService
    ) {}

    // Basic Functionality

    async create(createArticleDto: CreateArticleDto, uid: number) : Promise<Article> {
        const newArticle = this.articlesRepository.create(createArticleDto);
        const publisher = await this.usersService.findOne(uid);
        newArticle.publisher = publisher;
        return this.articlesRepository.save(newArticle);
    }

    findAll(): Promise<Article[]> {
        return this.articlesRepository.find({ order: { published_at: 'DESC' } });
    }

    findOne(id: number): Promise<Article> {
        return this.articlesRepository.findOneOrFail(id);
    }

    findWithPublisher(pubId: number): Promise<Article[]> {
        return this.articlesRepository.createQueryBuilder('A').where('A.publisherId = :pubId',{ pubId: pubId }).getMany();
    }

    async getFriendsArticles(uid: number): Promise<Article[]> {
        const friendIds = (await this.usersService.getFriends(uid)).map(f => f.id);
        friendIds.push(uid);
        return this.articlesRepository.find({ where: { publisher: { id: In(friendIds) } }, order: { published_at: 'DESC' } });
        // return this.articlesRepository.createQueryBuilder('A').leftJoinAndSelect('A.publisher','publisher').leftJoinAndSelect('A.reactions','reaction').leftJoinAndSelect('A.comments','comment').where('A.publisherId = :uid', { uid: uid })
        // .orWhere(existsQuery(this.friendshipRepository.createQueryBuilder('F').where('F.user1Id = A.publiserId').andWhere('F.user2Id = :uid', { uid: uid }).orWhere('F.user2Id = A.publisherId').andWhere('F.user1Id = :uid', { uid: uid }))).getMany();
    }

    update(id: number, updateArticleDto: UpdateArticleDto) {
        return this.articlesRepository.update(id, updateArticleDto);
    }

    delete(id: number) {
        return this.articlesRepository.delete(id);
    }

    // Reactions

    findArticleReaction(id: number) {
        return this.articleReactionsRepository.findOneOrFail(id);
    }
    
    async addArticleReaction(articleId: number, reactorId: number, addArticleReactionDto: AddArticleReactionDto): Promise<ArticleReaction> {
        // Check if the same reactor already reacted to this article
        const r = await this.articleReactionsRepository.createQueryBuilder('R').where('R.reactorId = :reactorId', { reactorId: reactorId }).andWhere('R.articleId = :articleId', { articleId: articleId }).getOne();
        if (r) {
            throw new ConflictException();
        }
        const articlePromise: Promise<Article> = this.findOne(articleId);
        const reactorPromise: Promise<User> = this.usersService.findOne(reactorId);
        return Promise.all([articlePromise, reactorPromise]).then(([article, reactor]) => {
            const reaction = this.articleReactionsRepository.create(addArticleReactionDto);
            reaction.article = article;
            reaction.reactor = reactor;
            return this.articleReactionsRepository.save(reaction);
        });
    }

    updateArticleReaction(id: number, updateArticleReactionDto: UpdateArticleReactionDto) {
        return this.articleReactionsRepository.update(id, updateArticleReactionDto);
    }

    deleteArticleReaction(id: number) {
        return this.articleReactionsRepository.delete(id);
    }

    // Comments

    findArticleComment(id: number) {
        return this.articleCommentsRepository.findOneOrFail(id);
    }

    addArticleComment(articleId: number, commenterId: number, addArticleCommentDto: AddArticleCommentDto): Promise<ArticleComment> {
        const articlePromise: Promise<Article> = this.findOne(articleId);
        const commenterPromise: Promise<User> = this.usersService.findOne(commenterId);
        return Promise.all([articlePromise, commenterPromise]).then(([article, reactor]) => {
            const comment = this.articleCommentsRepository.create(addArticleCommentDto);
            comment.article = article;
            comment.commenter = reactor;
            return this.articleCommentsRepository.save(comment);
        });
    }

    updateArticleComment(id: number, updateArticleCommentDto: UpdateArticleCommentDto) {
        return this.articleCommentsRepository.update(id, updateArticleCommentDto);
    }

    deleteArticleComment(id: number) {
        return this.articleCommentsRepository.delete(id);
    }
}
