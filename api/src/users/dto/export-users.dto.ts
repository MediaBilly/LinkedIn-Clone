import { IsEnum, IsInt } from "class-validator";

export class ExportUsersDto {
    @IsInt({ each: true})
    ids: number[];
}