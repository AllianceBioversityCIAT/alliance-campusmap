import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-information-pop-up-parking',
  imports: [CommonModule, RouterLink, ButtonModule, TranslateModule],
  templateUrl: './information-pop-up-parking.html',
  styleUrls: ['./information-pop-up-parking.scss']
})
export class InformationPopUpParking {
  @Input() placeName = '';
  @Input() imageUrl = '';
  @Input() isVisible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() showTransportSelector = new EventEmitter<void>();

  close(): void {
    this.isVisible = false;
    this.visibleChange.emit(false);
  }

  openTransportSelector(): void {
    this.close();
    this.showTransportSelector.emit();
  }
}
