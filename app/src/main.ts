import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./feature/root/component/app.component";
import {appConfig} from "./feature";


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
