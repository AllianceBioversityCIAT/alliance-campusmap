import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
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
    }, 3000); // Initial wait time
  }
}
