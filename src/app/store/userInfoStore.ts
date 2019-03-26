import { EntityState, EntityStore } from '@datorama/akita';
import { UserInfo } from '../models/store/UserInfo';
import { Injectable } from '@angular/core';

export interface State extends EntityState<UserInfo> {}

@Injectable({
    providedIn: 'root'
})
export class UserInfoStore extends EntityStore<State, UserInfo> {
    constructor() {
        super();
    }
}
