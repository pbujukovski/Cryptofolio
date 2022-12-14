import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLicense } from '@syncfusion/ej2-base';
export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

registerLicense(
 "Mgo+DSMBMAY9C3t2VVhjQlFac1dJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0diWn9WdX1WTmVaU0Q="
);

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
