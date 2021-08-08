import { IsString } from "class-validator";

export class UpdateArticleDto {
    @IsString()
    text: string;
}