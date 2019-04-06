import { FrameUserInfoMetadata } from './FrameUserInfoMetadata';

export type FrameUserInfo = {
    [userId: string]: FrameUserInfoMetadata
};

export function constructFrameUserInfo(userId: string, permissions: string[] = [], role: string): FrameUserInfo {
    return {
        [userId]: {
            permissions: permissions,
            role: role
        }
    };
}
