import { Frame } from '../Frame';
import { FrameImage } from '../FrameImage';
import { FrameUserInfo } from '../FrameUserInfo';
import { AnonymousImage } from '../AnonymousImage';

export class ClientFrame extends Frame {
    images: FrameImage[];
    anonymousImages: AnonymousImage[];
    users: FrameUserInfo;
    isOwner: boolean;

    constructor(frame: Frame, images: FrameImage[] = [], users: FrameUserInfo, anonymousImages: AnonymousImage[] = [],
        isOwner: boolean = false) {
        super(frame.id, frame.title, frame.description, frame.createdDate, frame.createdBy);
        this.images = images;
        this.users = users;
        this.anonymousImages = anonymousImages;
        this.isOwner = isOwner;
    }
}
