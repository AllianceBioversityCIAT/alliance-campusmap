import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-information-pop-up-timer',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './information-pop-up-timer.html',
  styleUrls: ['./information-pop-up-timer.scss']
})
export class InformationPopUpTimer implements OnInit {
  currentTime = '';

  ngOnInit(): void {
    this.updateTime();
  }

  updateTime(): void {
    this.currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}
