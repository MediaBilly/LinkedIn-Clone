import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { AddArticleCommentDto } from './dto/add-article-comment.dto';
import { AddArticleReactionDto } from './dto/add-article-reaction.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleCommentDto } from './dto/update-article-comment.dto';
import { UpdateArticleReactionDto } from './dto/update-article-reaction.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { IsArticleCommenterGuard } from './guards/is-article-commenter.guard';
import { IsArticleCreatorGuard } from './guards/is-article-creator.guard';
import { IsArticleReactorGuard } from './guards/is-article-reactor.guard';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    // Basic Functionality

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
        return this.articlesService.create(createArticleDto,req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    find(@Query('publisher') publisher) {
        if (publisher) {
            return this.articlesService.findWithPublisher(+publisher);
        } else {
            return this.articlesService.findAll();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('homepage')
    getHomepageArticles(@Request() req) {
        return this.articlesService.getFriendsArticles(+req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.articlesService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard, IsArticleCreatorGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
        return this.articlesService.update(+id, updateArticleDto);
    }

    @UseGuards(JwtAuthGuard, IsArticleCreatorGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.articlesService.delete(+id);
    }

    // Reactions

    @UseGuards(JwtAuthGuard)
    @Post(':id/react')
    addArticleReaction(@Request() req, @Param('id') id: string, @Body() addArticleReactionDto: AddArticleReactionDto) {
        return this.articlesService.addArticleReaction(+id, req.user.id, addArticleReactionDto);
    }

    @UseGuards(JwtAuthGuard, IsArticleReactorGuard)
    @Put('reactions/:id')
    updateArticleReaction(@Param('id') id: string, @Body() updateArticleReactionDto: UpdateArticleReactionDto) {
        return this.articlesService.updateArticleReaction(+id, updateArticleReactionDto);
    }
    
    @UseGuards(JwtAuthGuard, IsArticleReactorGuard)
    @Delete('reactions/:id')
    deleteArticleReaction(@Param('id') id: string) {
        return this.articlesService.deleteArticleReaction(+id);
    }

    // Comments

    @UseGuards(JwtAuthGuard)
    @Post(':id/comment')
    addArticleComment(@Request() req, @Param('id') id: string, @Body() addArticleCommentDto: AddArticleCommentDto) {
        return this.articlesService.addArticleComment(+id, req.user.id, addArticleCommentDto);
    }

    @UseGuards(JwtAuthGuard, IsArticleCommenterGuard)
    @Put('comments/:id')
    updateArticleComment(@Param('id') id: string, @Body() updateArticleCommentDto: UpdateArticleCommentDto) {
        return this.articlesService.updateArticleComment(+id, updateArticleCommentDto);
    }

    @UseGuards(JwtAuthGuard, IsArticleCommenterGuard)
    @Delete('comments/:id')
    deleteArticleComment(@Param('id') id: string) {
        return this.articlesService.deleteArticleComment(+id);
    }
}
