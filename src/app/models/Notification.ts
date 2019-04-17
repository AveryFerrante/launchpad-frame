import { NotificationTypes } from './NotificationTypes';
import { NotificationActions } from './NotificationActions';
import { DataTranslator } from './DataTranslator';

export class Notification extends DataTranslator {
    action: NotificationActions;
    frameId: string;
    frameName: string;
    fromuser: string;
    type: NotificationTypes;
    foruser: string;
    constructor(action: NotificationActions, frameId: string, frameName: string, fromuser: string, type: NotificationTypes,
        foruser: string) {
        super();
        this.action = action;
        this.frameId = frameId;
        this.frameName = frameName;
        this.fromuser = fromuser;
        this.type = type;
        this.foruser = foruser;
    }
}
