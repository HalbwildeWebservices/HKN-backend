import { IsBoolean, IsDate, IsOptional, IsString, IsUUID, IsArray, MaxLength, MinLength } from "class-validator";
export class CreateEventDto {
    @IsDate()
    readonly startDate: Date;

    @IsDate()
    readonly endDate: Date;

    @IsString()
    @MinLength(4)
    @MaxLength(30)
    readonly title: string;

    @IsBoolean()
    @IsOptional()
    readonly public?: boolean;

    @IsUUID(4)
    @IsArray({each: true})
    readonly editorIds: string[];

    @IsString()
    @MaxLength(400)
    readonly description: string;
}
