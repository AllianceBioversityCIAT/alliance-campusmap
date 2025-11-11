import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingModule, MessageModule, ToastModule, ButtonModule],
  templateUrl: './review.html',
  styleUrls: ['./review.scss'],
  providers: [MessageService]
})
export class Review {
  private readonly messageService = inject(MessageService);

  value: number | null = null;

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Form Submitted',
        life: 3000
      });
      form.resetForm();
    }
  }
}
