import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { awsConfigure } from './environments/environment';
import { Amplify } from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: awsConfigure.region,

    //REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: awsConfigure.identityPoolId,

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: awsConfigure.userPoolId,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: awsConfigure.userPoolWebClientId,

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,

    // OPTIONAL - Hosted UI configuration
    oauth: {
      domain: 'auction9.auth.eu-west-1.amazoncognito.com',
      scope: ['email', 'openid'],
      redirectSignIn: 'http://localhost:4200/',
      redirectSignOut: 'http://localhost:4200/',
      responseType: 'token', // 'code' or 'token', note that REFRESH token will only be generated when the responseType is code
    },
  },
  Storage: {
    AWSS3: {
      //REQUIRED -  Amazon S3 bucket name
      bucket: awsConfigure.bucket,

      //OPTIONAL -  Amazon service region
      region: awsConfigure
    }
  },
});

// You can get the current config object
const currentConfig = Auth.configure();
