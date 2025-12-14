import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-logo-section',
  imports: [TranslateModule],
  templateUrl: './logo-section.html',
  styleUrls: ['./logo-section.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoSection {}
