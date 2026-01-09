import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  output,
  computed
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../../../shared/services/language.service';

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
  styleUrls: ['./transport-button-selector.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportButtonSelector {
  //Injection of the PrimeNG messaging service to display notifications
  private readonly messageService: MessageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);

  routeSelected = output<{ mode: 1 | 2 }>();

  //Variable linked to SelectButton. Stores the selected option
  value = signal<string | null>(null);

  private currentLanguage = toSignal(this.languageService.currentLanguage$, {
    initialValue: this.languageService.getCurrentLanguage()
  });

  toggleButtonCheckedBackground = computed(() => {
    const currentLang = this.currentLanguage();
    return currentLang === 'es' ? 'var(--color-primary-green)' : 'var(--color-primary-blue)';
  });

  submitButtonBackground = computed(() => {
    const currentLang = this.currentLanguage();
    return currentLang === 'es' ? 'var(--background-green)' : 'var(--background-blue)';
  });

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
      const selectedMode = this.value() === 'carro' ? 2 : 1;

      this.routeSelected.emit({ mode: selectedMode });

      this.messageService.add({
        detail: this.translate.instant('Transport.start'),
        life: 1200
      });
      form.resetForm();
    }
  }
}
