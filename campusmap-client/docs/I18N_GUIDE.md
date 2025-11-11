# 🌍 Internationalization Guide (i18n)

This guide explains how to use the internationalization system in the **Campus Map** project.

## 📋 Table of Contents

1. [Current Configuration](#current-configuration)
2. [File Structure](#file-structure)
3. [How to Use i18n in Components](#how-to-use-i18n-in-components)
4. [Language Service](#language-service)
5. [Adding New Translations](#adding-new-translations)
6. [Best Practices](#best-practices)
7. [Complete Examples](#complete-examples)

---

## ⚙️ Current Configuration

The project uses **@ngx-translate** version 17 (standalone) with the following features:

- ✅ **Supported languages**: English (`en`) and Spanish (`es`)
- ✅ **Default language**: Spanish (`es`)
- ✅ **Persistence**: The selected language is saved in `localStorage`
- ✅ **Centralized service**: `LanguageService` for language management
- ✅ **Translation files**: JSON files located in `/public/assets/i18n/`

---

## 📁 File Structure

```
campusmap-client/
├── public/
│   └── assets/
│       └── i18n/
│           ├── en.json          # English translations
│           └── es.json          # Spanish translations
├── src/
│   └── app/
│       ├── core/
│       │   └── services/
│       │       └── language.service.ts    # Centralized service
│       └── app.config.ts        # i18n configuration
```

### Translation file contents

**`en.json`**

```json
{
  "Welcome": {
    "welcomeTo": "Welcome to the",
    "regionalHub": "Regional Hub for the Americas"
  },
  "Home": {
    "title": "To explore",
    "button": {
      "ready": "I'm ready!"
    }
  }
}
```

**`es.json`**

```json
{
  "Welcome": {
    "welcomeTo": "Bienvenidos a la",
    "regionalHub": "Sede Regional para las Américas"
  },
  "Home": {
    "title": "Para explorar",
    "button": {
      "ready": "¡Estoy listo!"
    }
  }
}
```

---

## 🎯 How to Use i18n in Components

### 1️⃣ In HTML Templates (`translate` pipe)

The most common and recommended way:

```html
<!-- Simple translation -->
<h1>{{ 'Home.title' | translate }}</h1>

<!-- Nested translation -->
<button>{{ 'Home.button.ready' | translate }}</button>

<!-- In attributes (using property binding) -->
<input [placeholder]="'Search.placeholder' | translate" />

<!-- In aria attributes (accessibility) -->
<section [attr.aria-label]="'Home.ariaLabel' | translate">
  <!-- In image alt attributes -->
  <img [attr.alt]="'Welcome.logoAlt' | translate" src="..." />
</section>
```

### 2️⃣ In TypeScript Code

When you need translations in component logic:

```typescript
import { Component, inject } from '@angular/core';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-example',
  standalone: true,
  templateUrl: './example.html'
})
export class ExampleComponent {
  private readonly languageService = inject(LanguageService);

  showMessage() {
    // Instant translation (synchronous)
    const message = this.languageService.instant('Home.title');
    console.log(message); // "Para explorar" or "To explore"

    // Asynchronous translation (Observable)
    this.languageService.get('Home.button.ready').subscribe(text => {
      console.log(text); // "¡Estoy listo!" or "I'm ready!"
    });
  }
}
```

### 3️⃣ Import TranslateModule

To use the `translate` pipe in a standalone component:

```typescript
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TranslateModule], // ← Important
  templateUrl: './example.html'
})
export class ExampleComponent {}
```

---

## 🔧 Language Service

### `LanguageService` - API

The centralized service provides these methods:

```typescript
import { inject } from '@angular/core';
import { LanguageService } from '@core/services/language.service';

class MyComponent {
  private readonly languageService = inject(LanguageService);

  // 1. Get current language
  getCurrentLang() {
    const lang = this.languageService.getCurrentLanguage();
    console.log(lang); // 'en' | 'es'
  }

  // 2. Change language
  changeToEnglish() {
    this.languageService.setLanguage('en');
  }

  // 3. Toggle between languages
  toggle() {
    this.languageService.toggleLanguage();
  }

  // 4. Watch language changes
  watchLanguage() {
    this.languageService.currentLanguage$.subscribe(lang => {
      console.log('Language changed to:', lang);
    });
  }

  // 5. Translate in code
  translate() {
    // Synchronous
    const text = this.languageService.instant('Home.title');

    // Asynchronous
    this.languageService.get('Home.title').subscribe(text => {
      console.log(text);
    });
  }
}
```

### Service Features

- ✅ **Singleton**: A single instance is created throughout the app
- ✅ **Automatic persistence**: Saves to `localStorage` automatically
- ✅ **Automatic initialization**: Loads the language when the app starts
- ✅ **Reactive**: Emits changes through `currentLanguage$` (Observable)

---

## ➕ Adding New Translations

### Step 1: Add keys in JSON files

**`en.json`**

```json
{
  "Map": {
    "search": {
      "placeholder": "Search places",
      "noResults": "No results found"
    }
  }
}
```

**`es.json`**

```json
{
  "Map": {
    "search": {
      "placeholder": "Buscar lugares",
      "noResults": "No se encontraron resultados"
    }
  }
}
```

### Step 2: Use in the component

```typescript
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <input type="text" [placeholder]="'Map.search.placeholder' | translate" />

    <p *ngIf="noResults">
      {{ 'Map.search.noResults' | translate }}
    </p>
  `
})
export class SearchComponent {
  noResults = false;
}
```

---

## ✨ Best Practices

### 1. Key Structure

Use a clear and consistent hierarchy:

```json
{
  "ModuleName": {
    "ComponentName": {
      "element": "Text"
    }
  }
}
```

**Example:**

```json
{
  "Map": {
    "filters": {
      "show": "Show filters",
      "categories": {
        "buildings": "Buildings",
        "parking": "Parking"
      }
    }
  }
}
```

### 2. Descriptive Names

```json
// ✅ Good
"Home.button.ready": "I'm ready!"
"Map.search.placeholder": "Search"

// ❌ Bad
"btn1": "I'm ready!"
"txt": "Search"
```

### 3. Consistency Between Languages

Make sure both files have the same keys:

```json
// en.json
{
  "Home": {
    "title": "To explore"
  }
}

// es.json
{
  "Home": {
    "title": "Para explorar"  // ✅ Same structure
  }
}
```

### 4. Don't Hardcode Text

```html
<!-- ❌ Bad -->
<h1>Welcome</h1>

<!-- ✅ Good -->
<h1>{{ 'Welcome.title' | translate }}</h1>
```

### 5. Use for Accessibility

```html
<!-- ✅ Translate aria attributes -->
<button [attr.aria-label]="'Home.button.ariaLabel' | translate">
  {{ 'Home.button.text' | translate }}
</button>

<!-- ✅ Translate image alt attributes -->
<img [attr.alt]="'Home.logo.alt' | translate" src="logo.png" />
```

---

## 📝 Complete Examples

### Example 1: Simple Component

```typescript
// example.component.ts
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <h1>{{ 'Example.title' | translate }}</h1>
    <p>{{ 'Example.description' | translate }}</p>
    <button>{{ 'Example.button.submit' | translate }}</button>
  `
})
export class ExampleComponent {}
```

```json
// en.json
{
  "Example": {
    "title": "Welcome",
    "description": "This is an example",
    "button": {
      "submit": "Submit"
    }
  }
}

// es.json
{
  "Example": {
    "title": "Bienvenido",
    "description": "Este es un ejemplo",
    "button": {
      "submit": "Enviar"
    }
  }
}
```

### Example 2: Language Toggle Button

```typescript
// language-toggle.component.ts
import { Component, inject } from '@angular/core';
import { LanguageService } from '@core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <button (click)="toggleLanguage()">
      {{ currentLang === 'en' ? '🇪🇸 Español' : '🇬🇧 English' }}
    </button>
  `
})
export class LanguageToggleComponent {
  private readonly languageService = inject(LanguageService);

  get currentLang() {
    return this.languageService.getCurrentLanguage();
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
}
```

### Example 3: Component with Logic

```typescript
// notification.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { LanguageService } from '@core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="notification">
      {{ message }}
    </div>
  `
})
export class NotificationComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  message = '';

  ngOnInit() {
    // Get translation on initialization
    this.message = this.languageService.instant('Notification.welcome', {
      username: 'John'
    });
  }
}
```

```json
// en.json
{
  "Notification": {
    "welcome": "Welcome, {{username}}!"
  }
}

// es.json
{
  "Notification": {
    "welcome": "¡Bienvenido, {{username}}!"
  }
}
```

---

## 🚀 Quick Summary

### To use i18n in a new component:

1. **Import `TranslateModule`** in the component
2. **Add translations** in `en.json` and `es.json`
3. **Use the** `translate` **pipe** in the template
4. **Optionally**: Inject `LanguageService` for TypeScript logic

### Useful commands:

```typescript
// Change language
this.languageService.setLanguage('en');

// Get current language
this.languageService.getCurrentLanguage();

// Translate in code
this.languageService.instant('key');
```

---

## 🔗 References

- [ngx-translate Documentation](https://github.com/ngx-translate/core)
- [Angular i18n Guide](https://angular.io/guide/i18n)
- Configuration file: `campusmap-client/src/app/app.config.ts`
- Service: `campusmap-client/src/app/core/services/language.service.ts`

---

**Last updated**: November 2025
