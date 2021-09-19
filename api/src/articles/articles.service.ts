import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, unlinkSync } from 'fs';
import { existsQuery } from 'src/helpers/existsQuery';
import { Friendship } from 'src/users/entities/friendship.entity';
import { NotificationType } from 'src/users/entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AddArticleCommentDto } from './dto/add-article-comment.dto';
import { AddArticleReactionDto } from './dto/add-article-reaction.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleCommentDto } from './dto/update-article-comment.dto';
import { UpdateArticleReactionDto } from './dto/update-article-reaction.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleComment } from './entities/article-comment.entity';
import { ArticleImage } from './entities/article-image.entity';
import { ArticleReaction } from './entities/article-reaction.entity';
import { ArticleVideo } from './entities/article-video.entity';
import { Article } from './entities/article.entity';
import { getImageLocation, getVideoLocation } from './helpers/article-media-storage';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article) private articlesRepository: Repository<Article>,
        @InjectRepository(ArticleReaction) private articleReactionsRepository: Repository<ArticleReaction>,
        @InjectRepository(ArticleComment) private articleCommentsRepository: Repository<ArticleComment>,
        @InjectRepository(ArticleImage) private articleImagesRepository: Repository<ArticleImage>,
        @InjectRepository(ArticleVideo) private articleVideosRepository: Repository<ArticleVideo>,
        @InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>,
        private usersService: UsersService
    ) {}

    // Basic Functionality

    async create(createArticleDto: CreateArticleDto, uid: number, files: { image?: Express.Multer.File[], video?: Express.Multer.File[] }) : Promise<Article> {
        // Create the article itself
        const newArticle = this.articlesRepository.create(createArticleDto);

        // Find and attach the publisher
        const publisher = await this.usersService.findOne(uid);
        newArticle.publisher = publisher;

        // Create the image promises
        const imagePromises: Promise<ArticleImage>[] = [];
        if (files.image) {
            for (let img of files.image) {
                let tmpImg = this.articleImagesRepository.create({ name: img.filename });
                imagePromises.push(this.articleImagesRepository.save(tmpImg));
            }
        }

        // Create the video promises
        const videoPromises: Promise<ArticleVideo>[] = [];
        if (files.video) {
            for (let vid of files.video) {
                let tmpVid = this.articleVideosRepository.create({ name: vid.filename });
                videoPromises.push(this.articleVideosRepository.save(tmpVid));
            }   
        }

        // Resolve image promises and create a set promise
        const imgSetPromise = Promise.all(imagePromises).then((images) => {
            newArticle.images = images;
        });

        // Resolve video promises and create a set promise
        const vidSetPromise = Promise.all(videoPromises).then((videos) => {
            newArticle.videos = videos;
        })

        // Wait for set promises and save the new article
        return Promise.all([imgSetPromise, vidSetPromise]).then(_ => {
            return this.articlesRepository.save(newArticle);
        });
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
        return this.articlesRepository.createQueryBuilder('A')
        .leftJoinAndSelect('A.publisher','publisher')
        .leftJoinAndSelect('A.reactions','reaction')
        .leftJoinAndSelect('A.comments','comment')
        .leftJoinAndSelect('A.images','image')
        .leftJoinAndSelect('A.videos','video')
        .leftJoinAndSelect('reaction.reactor','reactor')
        .leftJoinAndSelect('comment.commenter','commenter')
        .where('A.publisherId = :uid', { uid: uid })
        .orWhere(existsQuery(this.friendshipRepository.createQueryBuilder('F')
                            .where('F.user1Id = A.publisherId')
                            .andWhere('F.user2Id = :uid', { uid: uid })
                            .orWhere('F.user2Id = A.publisherId')
                            .andWhere('F.user1Id = :uid', { uid: uid })))
        .orderBy('A.published_at','DESC').getMany();
    }

    update(id: number, updateArticleDto: UpdateArticleDto) {
        return this.articlesRepository.update(id, updateArticleDto);
    }

    async delete(id: number) {
        const article = await this.findOne(id);
        // Delete images
        for (let img of article.images) {
            let loc = getImageLocation(img.name);
            if (existsSync(loc)) {
                unlinkSync(loc);
            }
        }
        // Delete videos
        for (let vid of article.videos) {
            let loc = getVideoLocation(vid.name);
            if (existsSync(loc)) {
                unlinkSync(loc);
            }
        }
        return this.articlesRepository.delete(id);
    }

    // Reactions

    findArticleReaction(id: number) {
        return this.articleReactionsRepository.createQueryBuilder('R').innerJoinAndSelect('R.article','article').innerJoinAndSelect('R.reactor','reactor').where('R.id = :id', { id: id }).getOne();
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
            return this.articleReactionsRepository.save(reaction).then(r => {
                if (reactor.id !== article.publisher.id) {
                    this.usersService.sendNotification(article.publisher, NotificationType.ARTICLE_REACTION, reactor, r.id);
                }
                return new Promise<ArticleReaction>((resolve, reject) => {
                    resolve(r);
                });
            });
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
        return this.articleCommentsRepository.createQueryBuilder('C').innerJoinAndSelect('C.article', 'article').innerJoinAndSelect('C.commenter', 'commenter').where('C.id = :id', { id: id }).getOne();
    }

    addArticleComment(articleId: number, commenterId: number, addArticleCommentDto: AddArticleCommentDto): Promise<ArticleComment> {
        const articlePromise: Promise<Article> = this.findOne(articleId);
        const commenterPromise: Promise<User> = this.usersService.findOne(commenterId);
        return Promise.all([articlePromise, commenterPromise]).then(([article, commenter]) => {
            const comment = this.articleCommentsRepository.create(addArticleCommentDto);
            comment.article = article;
            comment.commenter = commenter;
            return this.articleCommentsRepository.save(comment).then(c => {
                if (commenter.id !== article.publisher.id) {
                    this.usersService.sendNotification(article.publisher, NotificationType.ARTICLE_COMMENT, commenter, comment.id);
                }
                return new Promise<ArticleComment>((resolve, reject) => {
                    resolve(c);
                });
            });
        });
    }

    updateArticleComment(id: number, updateArticleCommentDto: UpdateArticleCommentDto) {
        return this.articleCommentsRepository.update(id, updateArticleCommentDto);
    }

    deleteArticleComment(id: number) {
        return this.articleCommentsRepository.delete(id);
    }
}
