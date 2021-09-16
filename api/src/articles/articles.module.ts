import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { UsersModule } from 'src/users/users.module';
import { ArticleReaction } from './entities/article-reaction.entity';
import { ArticleComment } from './entities/article-comment.entity';
import { ArticleImage } from './entities/article-image.entity';
import { ArticleVideo } from './entities/article-video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleReaction, ArticleComment, ArticleImage, ArticleVideo]), UsersModule],
  providers: [ArticlesService],
  controllers: [ArticlesController]
})
export class ArticlesModule {}
