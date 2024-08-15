import { bootstrapApplication } from '@angular/platform-browser';
import {config} from "./feature/root/component/app.config.server";
import {AppComponent} from "./feature/root/component/app.component";


const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
