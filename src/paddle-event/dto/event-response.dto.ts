import { PaddleEvent } from "../models/paddle-event.model";

export class EventResponseDto {
    readonly eventId: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly title: string;
    readonly description: string;
    readonly public: boolean;
    readonly editors: string[];
    readonly creatorId: string;

    constructor(event: PaddleEvent) {
        this.eventId = event.eventId;
        this.startDate = event.startDate;
        this.endDate = event.endDate;
        this.title = event.title;
        this.public = event.public;
        this.description = event.description;
        this.creatorId = event.creatorId;
        this.editors = event.editors.map((editor) => editor.userId)
    }
}