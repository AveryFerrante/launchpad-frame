import { Frame } from '../Frame';
import { FrameImage } from '../FrameImage';
import { FrameUserInfo } from '../FrameUserInfo';

export class ClientFrame extends Frame {
    userInfo: FrameUserInfo;

    constructor(frame: Frame, userInfo: FrameUserInfo) {
        super(frame.id, frame.title, frame.description, frame.createdDate);
        this.userInfo = userInfo;
    }
}
