import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from "primeng/button";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Button],
  templateUrl: './home.html'
})
export class Home implements OnInit {
  language: 'es' | 'en' = 'es';

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') as 'es' | 'en';
    this.language = savedLang || 'es';
  }

  setLanguage(lang: 'es' | 'en') {
    this.language = lang;
    localStorage.setItem('lang', lang);
    console.log('Lang:', lang);
  }
}