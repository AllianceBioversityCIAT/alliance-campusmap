import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transport-button-selector',
  imports: [
    FormsModule,
    SelectButtonModule,
    MessageModule,
    ToastModule,
    ButtonModule,
    TranslateModule
  ],
  providers: [MessageService],
  templateUrl: './transport-button-selector.html',
  styleUrls: ['./transport-button-selector.scss']
})
export class TransportButtonSelector {
  //Injection of the PrimeNG messaging service to display notifications
  private readonly messageService: MessageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  //Variable linked to SelectButton. Stores the selected option
  value: string | null = null;

  //Options available for the selector. Each one defines label, value and icon
  get stateOptions(): { label: string; value: string; icon?: string }[] {
    return [
      {
        label: this.translate.instant('Transport.car') as string,
        value: 'carro',
        icon: 'assets/icons/car.svg'
      },
      {
        label: this.translate.instant('Transport.walk') as string,
        value: 'caminar',
        icon: 'assets/icons/walk.svg'
      }
    ];
  }

  //Manages the submission of the form. Validate and display a message using Toast
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.messageService.add({
        detail: 'Form Submitted',
        life: 3000
      });
      form.resetForm();
    }
  }
}
