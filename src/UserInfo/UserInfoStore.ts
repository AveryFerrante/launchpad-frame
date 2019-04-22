import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from 'src/app/models/UserInfo';
import { skipWhile } from 'rxjs/operators';
import { UserFrames } from 'src/app/models/UserFrames';
import { cloneDeep } from 'lodash';

export class UserInfoStore {
    private static instance: UserInfoStore;
    private readonly _userInfo = new BehaviorSubject<UserInfo>(null);

    private constructor() {
    }

    static getInstance(): UserInfoStore {
        if (!UserInfoStore.instance) {
            UserInfoStore.instance = new UserInfoStore();
        }
        return UserInfoStore.instance;
    }

    /**
     * Sets the current state to null. Will emit the value.
     */
    public clear() {
        this.userInfo = null;
    }
    /**
     * Returns a deep clone of the current value of the user store
     */
    public getCurrent(): UserInfo {
        return this.userInfo;
    }

    /**
     * Sets the current state to the provided value
     * and emits. Previous state is lost
     * @param userInfo New value to set the store to
     */
    public set(userInfo: UserInfo) {
        this.userInfo = userInfo;
    }

    /**
     * adds a frame to the existing UserInfo.frames property, or
     * initializes one with the passed value. Emits the update.
     * @param frame the frame to add to the UserInfo snapshot
     */
    public addFrame(frame: UserFrames) {
        const userInfo = this.userInfo;
        const frames = userInfo.frames ? userInfo.frames : {};
        userInfo.frames = Object.assign(frames, frame);
        this.userInfo = userInfo;
    }

    /**
     * Returns an observable that will not emit until a non-null value
     */
    public getNonNullWatcher(): Observable<UserInfo> {
        return this.getWatcher().pipe(
            skipWhile((userInfo: UserInfo) => userInfo === null)
        );
    }

    /**
     * Provides observable that will emit any time the UserInfo is updated.
     */
    public getWatcher(): Observable<UserInfo> {
        return this._userInfo.asObservable();
    }

    private set userInfo(value: UserInfo) {
        this._userInfo.next(value);
    }

    private get userInfo(): UserInfo {
        return cloneDeep(this._userInfo.getValue());
    }

}
