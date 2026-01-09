import { Component, input, output, signal, ChangeDetectionStrategy, effect } from '@angular/core';
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
  images = input<{ id: number; img: string }[]>([]);
  isVisible = input(false);
  visibleChange = output<boolean>();
  showTransportSelector = output<void>();

  imageLoaded = signal(true);
  showFallback = signal(false);

  constructor() {
    effect(() => {
      if (this.imageUrl()) {
        this.imageLoaded.set(true);
        this.showFallback.set(false);
      }
    });

    effect(() => {
      if (this.placeName()) {
        this.imageLoaded.set(true);
        this.showFallback.set(false);
      }
    });
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  openTransportSelector(): void {
    this.close();
    this.showTransportSelector.emit();
  }
}
