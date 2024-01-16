import { Component } from '@angular/core';
import { DestroyerComponent } from "./shared/components/app-destroyer.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends DestroyerComponent {

}

