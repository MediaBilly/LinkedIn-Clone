import { IsString } from "class-validator";

export class UpdateArticleCommentDto {
    @IsString()
    text: string;
}