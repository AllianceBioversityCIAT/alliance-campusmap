import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-information-pop-up',
  imports: [CommonModule, ButtonModule, TranslateModule],
  templateUrl: './information-pop-up.html',
  styleUrls: ['./information-pop-up.scss']
})
export class InformationPopUp {
  @Input() placeName = '';
  @Input() placeType = '';
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
