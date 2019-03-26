import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { UserInfo } from '../models/store/UserInfo';
import { UserInfoStore, State } from './userInfoStore';

@Injectable({
    providedIn: 'root'
})
export class UserInfoQuery extends QueryEntity<State, UserInfo> {
    constructor(protected store: UserInfoStore) {
        super(store);
    }
}
