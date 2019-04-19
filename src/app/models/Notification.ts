import { NotificationTypes } from './NotificationTypes';
import { NotificationActions } from './NotificationActions';
import { DataTranslator } from './DataTranslator';

export class Notification extends DataTranslator {
    id: string;
    action: NotificationActions;
    frameId: string;
    frameName: string;
    fromuser: string;
    fromusername: string;
    type: NotificationTypes;
    foruser: string;
    constructor(id: string, action: NotificationActions, frameId: string, frameName: string, fromuser: string, fromusername: string,
        type: NotificationTypes, foruser: string) {
        super();
        this.id = id;
        this.action = action;
        this.frameId = frameId;
        this.frameName = frameName;
        this.fromuser = fromuser;
        this.fromusername = fromusername;
        this.type = type;
        this.foruser = foruser;
    }
}
