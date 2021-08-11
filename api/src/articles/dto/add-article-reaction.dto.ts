import { IsEnum } from "class-validator";
import { ReactionType } from "../enums/reaction-type.enum";

export class AddArticleReactionDto {
    @IsEnum(ReactionType)
    type: ReactionType;
}