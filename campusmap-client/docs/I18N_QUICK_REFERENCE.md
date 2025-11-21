# 🌍 i18n - Quick Reference

## 🚀 Quick Start

### 1. Use translations in HTML

```html
<!-- Simple text -->
<h1>{{ 'Home.title' | translate }}</h1>

<!-- In attributes -->
<input [placeholder]="'Search.placeholder' | translate" />

<!-- In aria-label -->
<button [attr.aria-label]="'Button.ariaLabel' | translate">{{ 'Button.text' | translate }}</button>
```

### 2. Import TranslateModule

```typescript
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [TranslateModule] // ← Add here
})
export class MyComponent {}
```

### 3. Use in TypeScript

```typescript
import { inject } from '@angular/core';
import { LanguageService } from '@core/services/language.service';

class MyComponent {
  private languageService = inject(LanguageService);

  // Translate
  text = this.languageService.instant('Home.title');

  // Change language
  changeLanguage() {
    this.languageService.setLanguage('en'); // or 'es'
  }
}
```

## 📁 Translation Files

Location: `public/assets/i18n/`

**en.json**

```json
{
  "Home": {
    "title": "Welcome",
    "button": "Click here"
  }
}
```

**es.json**

```json
{
  "Home": {
    "title": "Bienvenido",
    "button": "Haz clic aquí"
  }
}
```

## 🎯 LanguageService API

```typescript
// Change language
languageService.setLanguage('en' | 'es');

// Get current language
languageService.getCurrentLanguage();

// Toggle language
languageService.toggleLanguage();

// Translate in code
languageService.instant('key');
languageService.get('key'); // Observable
```

## ✅ Checklist for New Component

- [ ] Import `TranslateModule` in the component
- [ ] Add translations in `en.json` and `es.json`
- [ ] Use pipe `| translate` in the template
- [ ] Verify both languages have the same keys

## 📖 Full Documentation

See: `docs/I18N_GUIDE.md`

---

**Languages**: English (en) | Spanish (es)  
**Default**: Spanish (es)  
**Storage**: localStorage ('lang')
