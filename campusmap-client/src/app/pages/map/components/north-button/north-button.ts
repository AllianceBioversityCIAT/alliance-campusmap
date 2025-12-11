import { Component, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-north-button',
  templateUrl: './north-button.html',
  styleUrl: './north-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class NorthButtonComponent {
  resetNorth = output<void>();

  onNorthClick(): void {
    this.resetNorth.emit();
  }
}
