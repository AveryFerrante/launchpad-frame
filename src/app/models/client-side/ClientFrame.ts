import { Frame } from '../Frame';

export class ClientFrame extends Frame {

    constructor(frame: Frame) {
        super(frame.id, frame.title, frame.description, frame.createdDate);
    }
}
