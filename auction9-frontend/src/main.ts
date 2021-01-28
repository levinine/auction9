import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
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
    region: 'eu-west-1',

    //REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: 'eu-west-1:708b1637-6afc-4698-b5a0-6c8f2cd3b52e',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'eu-west-1_hx2LFOcz2',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '6upsbt836sfi1kdigjvnp18mvr',

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
      bucket: 'auction9-auction-photos',

      //OPTIONAL -  Amazon service region
      region: 'eu-west-1'
    }
  },
});

// You can get the current config object
const currentConfig = Auth.configure();
