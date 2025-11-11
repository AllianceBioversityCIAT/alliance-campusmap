import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-logo-section',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './logo-section.html',
  styleUrls: ['./logo-section.scss']
})
export class LogoSection {}
