import { Frame } from '../Frame';
import { FrameImage } from '../FrameImage';
import { FrameUserInfo } from '../FrameUserInfo';

export class ClientFrame extends Frame {
    images: FrameImage[];
    users: FrameUserInfo;
    isOwner: boolean;

    constructor(frame: Frame, images: FrameImage[] = [], users: FrameUserInfo, isOwner: boolean = false) {
        super(frame.id, frame.title, frame.description, frame.createdDate, frame.createdBy);
        this.images = images;
        this.users = users;
        this.isOwner = isOwner;
    }
}
