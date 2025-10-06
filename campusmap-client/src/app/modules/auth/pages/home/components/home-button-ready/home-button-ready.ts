import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-button-ready',
  standalone: true,
  imports: [RouterModule, ButtonModule, ButtonDirective, TranslateModule],
  templateUrl: './home-button-ready.html',
  styleUrl: './home-button-ready.scss'
})
export class HomeButtonReady {}
