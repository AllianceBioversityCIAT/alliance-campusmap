import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LogoSection } from './components/logo-section/logo-section';
import { Map } from '../../../map/pages/map/map';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, LogoSection, Map],
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
      }, 600); // Duration fade out
    }, 3000); // Initial wait time
  }
}
