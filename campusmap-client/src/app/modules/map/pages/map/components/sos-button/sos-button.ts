import { Component, ChangeDetectionStrategy, output } from '@angular/core';

@Component({
  selector: 'app-sos-button',
  imports: [],
  templateUrl: './sos-button.html',
  styleUrl: './sos-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SosButton {
  sosClicked = output<void>();
  onClick(): void {
    this.sosClicked.emit();
  }
}
