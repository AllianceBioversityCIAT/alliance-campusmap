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
  //Saves the current time displayed in the pop-up
  currentTime = '';

  ngOnInit(): void {
    this.updateTime(); //Updates the time when loading
  }

  //Gets the current time in hh:mm AM/PM format
  updateTime(): void {
    this.currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}
