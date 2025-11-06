import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-transport-button-selector',
  standalone: true,
  imports: [FormsModule, SelectButtonModule, MessageModule, ToastModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './transport-button-selector.html',
  styleUrls: ['./transport-button-selector.scss']
})
export class TransportButtonSelector {
  private readonly messageService: MessageService = inject(MessageService);

  value: string | null = null;

  stateOptions: { label: string; value: string; icon?: string }[] = [
    { label: 'En carro', value: 'carro', icon: 'assets/icons/car.svg' },
    { label: 'A pie', value: 'caminar', icon: 'assets/icons/walk.svg' }
  ];

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
