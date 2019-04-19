import { FrameUserInfoMetadata } from './FrameUserInfoMetadata';
import { FrameUserInfoPendingMetadata } from './FrameUserInfoPendingMetadata';
import { Username } from './Username';

export type FrameUserInfo = {
    users: {
        [userId: string]: FrameUserInfoMetadata
    }
    pendingUsers: {
        [userId: string]: FrameUserInfoPendingMetadata
    }
};

export function constructFrameUserInfo(userId: string, permissions: string[] = [], role: string,
    username: string, usersToAdd: Username[] = []): FrameUserInfo {
    const fui: FrameUserInfo = {
        users: {
            [userId]: {
                permissions: permissions,
                role: role,
                username: username
            }
        },
        pendingUsers: { }
    };
    for (const user of usersToAdd) {
        const pendingUser: FrameUserInfoPendingMetadata = {
            userName: user.username,
            invitedOn: new Date(),
            invitedBy: userId
        };
        fui.pendingUsers[user.userid] = pendingUser;
    }
    return fui;
}
