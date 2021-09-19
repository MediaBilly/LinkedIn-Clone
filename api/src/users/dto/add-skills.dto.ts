import { MinLength } from "class-validator";

export class AddSkillsDto {
    @MinLength(1, {
        each: true
    })
    skills: string[];
}