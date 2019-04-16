import { FrameUserInfoMetadata } from './FrameUserInfoMetadata';

export type FrameUserInfo = {
    users: {
        [userId: string]: FrameUserInfoMetadata
    }
};

export function constructFrameUserInfo(userId: string, permissions: string[] = [], role: string, username: string): FrameUserInfo {
    return {
        users: {
            [userId]: {
                permissions: permissions,
                role: role,
                username: username
            }
        }
    };
}
