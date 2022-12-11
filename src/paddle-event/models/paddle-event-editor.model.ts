import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/models/user.model";
import { PaddleEvent } from "./paddle-event.model";

@Table
export class PaddleEventEditor extends Model {
    @ForeignKey(() => PaddleEvent)
    @Column
    eventId: string;

    @ForeignKey(() => User)
    @Column
    userId: string;
}