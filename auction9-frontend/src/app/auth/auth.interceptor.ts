import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AppComponent } from '../app.component';

/**
 * This will append jwt token for the http requests.
 *
 * @export
 * @class JwtInterceptor
 * @implements {HttpInterceptor}
 */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return from(Auth.currentSession())
      .pipe(
        switchMap((auth: any) => {
          AppComponent.isLoggedIn = true;
          AppComponent.loggedUser = auth['idToken']['payload']['email'];
          // Clone request and attach jwt token to it
          let jwt = auth.accessToken.jwtToken;
          let with_auth_request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${jwt}`
            }
          });

          return next.handle(with_auth_request).pipe(
            // The only status code we care about is 401, if token expires
            catchError((err) => {
              if (err.status === 401) {
                // Auto logout if 401 response returned from api
                Auth.signOut();
                AppComponent.isLoggedIn = false;
                AppComponent.loggedUser = null;
              }
              // err.error.message will give the custom message send from the server
              const error = err.error.message || err.statusText;
              return throwError(error);
            }));

        }),
        // This is error if we don't even get the request (user is not signed in)
        catchError((err) => {
          return next.handle(request).pipe(
            catchError((err: any) => {
              if (err.status === 401) {
                Auth.signOut();
                AppComponent.isLoggedIn = false;
                AppComponent.loggedUser = null;
              }
              else {
                const error = err.error.message || err.statusText;
                return throwError(error)
              }
            }));
        })
      );
  }
}
