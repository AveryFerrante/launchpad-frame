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
                username: username,
                joined: new Date(),
                pictureCount: 0
            }
        },
        pendingUsers: { }
    };
    for (const user of usersToAdd) {
        const pendingUser: FrameUserInfoPendingMetadata = {
            username: user.username,
            invitedOn: new Date(),
            invitedById: userId,
            invitedByUsername: username
        };
        fui.pendingUsers[user.userid] = pendingUser;
    }
    return fui;
}

export function constructFrameUserInfoPending(username: string, invitedById: string, invitedByUsername: string): FrameUserInfoPendingMetadata {
    return {
        username: username,
        invitedOn: new Date(),
        invitedById: invitedById,
        invitedByUsername: invitedByUsername
    }
}
