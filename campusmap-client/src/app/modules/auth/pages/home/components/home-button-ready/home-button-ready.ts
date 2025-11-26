import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-button-ready',
  imports: [RouterModule, ButtonModule, ButtonDirective, TranslateModule],
  templateUrl: './home-button-ready.html',
  styleUrls: ['./home-button-ready.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeButtonReady {}
