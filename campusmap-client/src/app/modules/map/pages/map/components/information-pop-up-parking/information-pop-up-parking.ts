import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-information-pop-up-parking',
  imports: [RouterLink, ButtonModule, TranslateModule],
  templateUrl: './information-pop-up-parking.html',
  styleUrls: ['./information-pop-up-parking.scss']
})
export class InformationPopUpParking {}
