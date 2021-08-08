import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article) private articlesRepository: Repository<Article>,
        private usersService: UsersService
    ) {}

    async create(createArticleDto: CreateArticleDto, uid: number) : Promise<Article> {
        const newArticle = this.articlesRepository.create(createArticleDto);
        const publisher = await this.usersService.findOne(uid);
        newArticle.publisher = publisher;
        return this.articlesRepository.save(newArticle);
    }

    findAll(): Promise<Article[]> {
        return this.articlesRepository.find();
    }

    findOne(id: number): Promise<Article> {
        return this.articlesRepository.findOneOrFail(id);
    }

    findWithPublisher(pubId: number): Promise<Article[]> {
        return this.articlesRepository.createQueryBuilder('A').where('publisherId = :pubId',{ pubId: pubId }).getMany();
    }

    update(id: number, updateArticleDto: UpdateArticleDto) {
        return this.articlesRepository.update(id, updateArticleDto);
    }

    delete(id: number) {
        return this.articlesRepository.delete(id);
    }
}
