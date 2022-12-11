import { randomUUID } from "crypto";
import { BelongsTo, BelongsToMany, Column, Default, ForeignKey, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/users/models/user.model";
import { PaddleEventEditor } from "./paddle-event-editor.model";

@Table
export class PaddleEvent extends Model {
    
    @IsUUID(4)
    @PrimaryKey
    @Default(randomUUID)
    @Column
    eventId: string;

    @Column
    title: string;

    @Column 
    startDate: Date;

    @Column
    endDate: Date;

    @Column
    description: string;

    @Default(false)
    @Column
    public: boolean

    @ForeignKey(() => User)
    @Column
    creatorId: string

    @BelongsTo(() => User, 'creatorId')
    user: User;

    @BelongsToMany(() => User, () => PaddleEventEditor)
    editors: User[];
}
