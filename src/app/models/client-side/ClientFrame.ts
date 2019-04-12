import { Frame } from '../Frame';
import { FrameImage } from '../FrameImage';

export class ClientFrame extends Frame {
    images: FrameImage[];
    isOwner: boolean;

    constructor(frame: Frame, images: FrameImage[] = [], isOwner: boolean = false) {
        super(frame.id, frame.title, frame.description, frame.createdDate);
        this.images = images;
        this.isOwner = isOwner;
    }
}
