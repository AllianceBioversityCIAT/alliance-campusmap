import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-message',
  imports: [CommonModule, TranslateModule],
  templateUrl: './home-message.html',
  styleUrls: ['./home-message.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeMessage {}
