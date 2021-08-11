import { IsString } from "class-validator";

export class AddArticleCommentDto {
    @IsString()
    text: string;
}