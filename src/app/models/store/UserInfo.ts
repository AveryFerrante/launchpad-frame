import { ID } from '@datorama/akita';

export type UserInfo = {
    id: ID;
    firstName: string;
    lastName: string;
};

export function createUserInfo({ id, firstName, lastName}): Partial<UserInfo> {
    return {
        id,
        firstName,
        lastName
    } as UserInfo;
}
