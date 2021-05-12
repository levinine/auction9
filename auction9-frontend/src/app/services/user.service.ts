import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface UserInfo {
  email: string;
  externalId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createUser(userInfo: UserInfo) {
    return this.http.post(`${environment.baseUrl}/users/create`, userInfo).toPromise();
  }

}
