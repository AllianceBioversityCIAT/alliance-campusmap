# 🗺️ Campus Map

A modern Angular project with updated technology stack for creating interactive university campus maps.

## 🚀 Technology Stack

This project uses the following technologies and tools:

### 🅰️ **Angular 20.2.0**
- Main framework with the latest features
- Standalone components (no NgModules)
- Signals for reactive state management
- Native control flow (`@if`, `@for`, `@switch`)
- OnPush change detection by default

### 🎨 **PrimeNG 20.1.2**
- Complete UI component library
- Customizable themes with PrimeUIX
- Components optimized for Angular 20+
- Full support for standalone components

### 💨 **Tailwind CSS 4.1.13**
- Utility-first CSS framework
- Configuration optimized for Angular
- Integrated PostCSS
- Responsive and modern design

### 🧪 **Jest 30.1.3**
- Modern testing framework
- Replaces Karma/Jasmine
- Configuration optimized for Angular
- Support for ESM and TypeScript

### ✨ **Prettier 3.6.2**
- Automatic code formatter
- Configured to format on save
- Custom rules for Angular
- Integration with ESLint

### 🔍 **ESLint 9.35.0**
- Static code analysis
- Angular-specific rules
- TypeScript integration
- Auto-correction configured

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd alliance-campusmap/campusmap-client

# Install dependencies
npm install

# Install Jest dependencies (if needed)
sudo npm install --save-dev jest @types/jest jest-preset-angular ts-node jest-environment-jsdom
```

## 🛠️ Development Commands

### Development Server
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200/`. The application will automatically reload when you modify files.

### Production Build
```bash
npm run build
# or
ng build
```
The build artifacts will be stored in the `dist/` directory.

### Testing with Jest
```bash
# Run all tests
npm test

# Watch mode (development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Linting
```bash
# Check code
npm run lint
# or
ng lint
```

### Code Formatting
Code is automatically formatted on save thanks to Prettier configuration in VS Code.

## ⚙️ Development Environment Setup

### VS Code (Recommended)

#### Required Extensions
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **Angular Language Service** (`angular.ng-template`)

#### Automatic Configuration
The project includes automatic configuration in `.vscode/`:

**`.vscode/settings.json`**:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

**`.vscode/extensions.json`**:
```json
{
  "recommendations": [
    "angular.ng-template",
    "esbenp.prettier-vscode"
  ]
}
```

### Prettier Configuration
**`.prettierrc`**:
```json
{
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "trailingComma": "none",
  "bracketSameLine": true,
  "printWidth": 100,
  "endOfLine": "auto",
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

### Jest Configuration
**`jest.config.ts`**:
```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(js|ts)',
    '<rootDir>/src/**/?(*.)(spec|test).(js|ts)'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/main.ts'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)']
};

export default config;
```

## 🏗️ Project Structure

```
campusmap-client/
├── src/
│   ├── app/
│   │   ├── app.ts                 # Main component
│   │   ├── app.html               # Template with documentation
│   │   ├── app.scss               # Component styles
│   │   ├── app.config.ts          # App configuration
│   │   └── app.routes.ts          # Application routes
│   ├── styles.scss                # Global styles
│   └── main.ts                    # Entry point
├── .vscode/                       # VS Code configuration
├── jest.config.ts                 # Jest configuration
├── setup-jest.ts                  # Jest setup for Angular
├── .prettierrc                    # Prettier configuration
├── angular.json                   # Angular CLI configuration
├── tailwind.config.js             # Tailwind configuration
└── package.json                   # Dependencies and scripts
```

## 🎯 Implemented Best Practices

### Modern Angular
- ✅ **Standalone Components**: No need for NgModules
- ✅ **Signals**: For reactive state management
- ✅ **Native Control Flow**: `@if`, `@for`, `@switch` instead of structural directives
- ✅ **OnPush Change Detection**: Performance optimization
- ✅ **input()** and **output()**: Functions instead of decorators

### Development
- ✅ **Jest**: Modern and fast testing
- ✅ **Prettier + ESLint**: Automatic code formatting and quality
- ✅ **Tailwind CSS**: Utility styles for rapid development
- ✅ **PrimeNG**: Professional UI components
- ✅ **TypeScript Strict**: Strict configuration for better typing

### Tool Configuration
- ✅ **Auto-formatting**: Code automatically formatted on save
- ✅ **Auto-lint**: Automatic ESLint problem correction
- ✅ **VS Code Extensions**: Automatic recommendations
- ✅ **Integrated Testing**: Jest configured for Angular

## 📚 Usage Guides

### Using PrimeNG
```typescript
// In your component
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-example',
  imports: [ButtonModule, TableModule], // Standalone components
  template: `
    <p-button label="Click me" icon="pi pi-check"></p-button>
    <p-table [value]="data" [columns]="columns"></p-table>
  `
})
export class ExampleComponent {
  // Implementation
}
```

### Using Tailwind CSS
```html
<!-- Utility classes for rapid design -->
<div class="flex items-center justify-between bg-white shadow-md rounded-lg p-6">
  <h1 class="text-2xl font-bold text-gray-900">Title</h1>
  <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    Button
  </button>
</div>
```

### Writing Tests with Jest
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleComponent } from './example.component';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleComponent] // Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## 🔄 Migration from Karma to Jest

This project has been migrated from Karma/Jasmine to Jest following best practices:

1. **Karma Uninstallation**: Removed all Karma-related dependencies
2. **Jest Installation**: Added Jest and jest-preset-angular dependencies
3. **Configuration**: Created `jest.config.ts` and `setup-jest.ts`
4. **Updated Scripts**: Test commands point to Jest
5. **TypeScript**: Updated `tsconfig.spec.json` for Jest

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Production build |
| `npm test` | Run tests with Jest |
| `npm run test:watch` | Tests in watch mode |
| `npm run test:coverage` | Tests with coverage report |
| `npm run lint` | Check code with ESLint |

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

**Developed with ❤️ using Angular 20 and modern best practices**
