import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-information-pop-up',
  imports: [CommonModule, ButtonModule, TranslateModule],
  templateUrl: './information-pop-up.html',
  styleUrls: ['./information-pop-up.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformationPopUp {
  placeName = input('');
  placeType = input('');
  imageUrl = input('');
  isVisible = input(false);
  visibleChange = output<boolean>();
  showTransportSelector = output<void>();

  close(): void {
    this.visibleChange.emit(false);
  }

  openTransportSelector(): void {
    this.close();
    this.showTransportSelector.emit();
  }
}
