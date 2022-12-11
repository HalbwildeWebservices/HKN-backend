import { IsBoolean, IsDate, IsOptional, IsString, IsUUID, IsArray, MaxLength, MinLength } from "class-validator";
export class PatchEventDto {
    @IsDate()
    @IsOptional()
    readonly startDate?: Date;

    @IsDate()
    @IsOptional()
    readonly endDate?: Date;

    @IsString()
    @MinLength(4)
    @MaxLength(30)
    @IsOptional()
    readonly title?: string;

    @IsBoolean()
    @IsOptional()
    readonly public?: boolean;

    @IsUUID(4)
    @IsOptional()
    @IsArray({each: true})
    readonly editorIds?: string[];

    @IsString()
    @MaxLength(400)
    @IsOptional()
    readonly description?: string;
}
