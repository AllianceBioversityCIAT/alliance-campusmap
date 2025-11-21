import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LogoSection } from './components/logo-section/logo-section';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, LogoSection],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss']
})
export class Welcome implements OnInit {
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);
  fadeOut = signal(false);

  ngOnInit(): void {
    // The language is already initialized automatically in the LanguageService

    setTimeout(() => {
      this.fadeOut.set(true);

      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 600); // Duration fade out
    }, 3000); // Initial wait time
  }
}
