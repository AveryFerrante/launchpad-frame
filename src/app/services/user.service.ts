import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { LoginCredentials } from 'src/models/login credentials';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseRoute = environment.APIEndpoint + 'users/';
  constructor(private http: HttpClient) { }

  validateUser(credentials: LoginCredentials): Observable<number> {
    return this.http.post<number>(this.baseRoute + 'validate', credentials);
  }
}
