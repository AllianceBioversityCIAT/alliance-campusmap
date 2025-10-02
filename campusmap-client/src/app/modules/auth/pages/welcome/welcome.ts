import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LogoSection } from './components/logo-section/logo-section';
import { WelcomeMessage } from './components/welcome-message/welcome-message';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, LogoSection, WelcomeMessage],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class Welcome implements OnInit {
  private readonly router = inject(Router);
  fadeOut = signal(false);

  ngOnInit(): void {
    setTimeout(() => {
      this.fadeOut.set(true);

      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 600); // Duration of the fade out
    }, 5000); // Initial wait time
  }
}
