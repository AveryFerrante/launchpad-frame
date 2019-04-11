import { Frame } from '../Frame';
import { FrameImage } from '../FrameImage';

export class ClientFrame extends Frame {
    images: FrameImage[];

    constructor(frame: Frame, images: FrameImage[] = []) {
        super(frame.id, frame.title, frame.description, frame.createdDate);
        this.images = images;
    }
}
