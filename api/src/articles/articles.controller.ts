import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { IsArticleCreatorGuard } from './guards/is-article-creator.guard';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
        return this.articlesService.create(createArticleDto,req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.articlesService.findAll();
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
}
