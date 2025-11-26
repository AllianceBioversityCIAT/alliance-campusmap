import { Component, output, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-location-permission-popup',
  imports: [TranslateModule],
  templateUrl: './location-permission-popup.html',
  styleUrls: ['./location-permission-popup.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationPermissionPopup {
  accepted = output<void>();
  declined = output<void>();

  onAccept(): void {
    this.accepted.emit();
  }

  onDecline(): void {
    this.declined.emit();
  }
}
