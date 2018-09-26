import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {AdminModule} from './admin.module';
import {AppModule} from './app.module';
import {enableProdMode} from '@angular/core';


enableProdMode();
const platform = platformBrowserDynamic();
//platform.bootstrapModule(AdminModule);
platform.bootstrapModule(AppModule);