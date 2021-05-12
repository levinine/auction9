import { Component } from '@angular/core';
import { Auth } from 'aws-amplify';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  static isLoggedIn : boolean;
  static loggedUser: string;

  constructor(private userService: UserService) {
    AppComponent.isLoggedIn = false;
    AppComponent.loggedUser = null;
  }

  ngOnInit(): void {
    Auth.currentSession().then(session => {
      const email = session['idToken']['payload']['email']
      const id = session['idToken']['payload']['sub']
      this.userService.createUser({email, externalId: id}).then((response: any) => {
        AppComponent.loggedUser = session['idToken']['payload']['email'];
        AppComponent.isLoggedIn = true;
      }).catch(e => {
        console.log('Failed to register user', e);
      });
    }).catch(e => {
      console.log('Failed to fetch user from session', e);
    })
  }
}
