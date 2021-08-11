import { IsEnum } from "class-validator";
import { ReactionType } from "../enums/reaction-type.enum";

export class UpdateArticleReactionDto {
    @IsEnum(ReactionType)
    type: ReactionType;
}