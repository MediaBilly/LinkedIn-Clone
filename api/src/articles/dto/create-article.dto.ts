import { IsString } from "class-validator";

export class CreateArticleDto {
    @IsString()
    text: string;
}