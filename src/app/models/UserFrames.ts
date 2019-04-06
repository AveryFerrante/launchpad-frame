import { UserFrameMetadata } from './UserFramesMetadata';

export type UserFrames = {
    [frameId: string]: UserFrameMetadata;
};

export function constructUserFrame(frameId: string, name: string, role: string) {
    return {
        [frameId]: {
            name: name,
            role: role
        }
    };
}
