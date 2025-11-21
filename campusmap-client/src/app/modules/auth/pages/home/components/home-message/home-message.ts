import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-message',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './home-message.html',
  styleUrls: ['./home-message.scss']
})
export class HomeMessage {}
