# UI Kit

A modern UI component library and e-commerce starter kit built with Laravel, React, and Tailwind CSS.

![UI Kit Banner](https://via.placeholder.com/1200x300/5a67d8/FFFFFF?text=UI+Kit+Banner)

## 🌟 Overview

UI Kit is a comprehensive starter kit that combines Laravel's backend power with React's frontend flexibility. It includes a rich set of pre-built UI components, layouts, and pages to accelerate application development.

## ✨ Features

- **Modern Tech Stack**: Laravel 12, React 19, TypeScript, Tailwind CSS 4
- **Component Library**: 40+ reusable React components
- **Authentication**: Full authentication system with password reset
- **E-commerce Ready**: Product listings, cart, checkout, favorites
- **Dashboard Layout**: Admin dashboard with analytics
- **Form Components**: Input, Select, Checkbox, Radio, etc.
- **Theming**: Light and dark mode support
- **Real-time Capabilities**: WebSockets integration with Laravel Reverb
- **Mobile Responsive**: All components work on mobile and desktop

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+
- Node.js 18+
- Composer
- SQLite or MySQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ui-kit.git
cd ui-kit
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install JavaScript dependencies:

```bash
npm install
```

4. Copy the environment file:

```bash
cp .env.example .env
```

5. Generate application key:

```bash
php artisan key:generate
```

6. Create SQLite database (or configure MySQL in `.env`):

```bash
touch database/database.sqlite
```

7. Run migrations:

```bash
php artisan migrate
```

8. Start the development server:

```bash
npm run dev
# or with SSR
npm run dev:ssr
```

## 🧩 Components

UI Kit includes a wide range of components:

- **Layout Components**: App Header, Sidebar, Navigation Menu
- **Form Components**: Input, Select, Checkbox, Radio, etc.
- **Data Display**: Table, Card, Badge
- **Feedback**: Alert, Dialog, Toast
- **Navigation**: Breadcrumb, Pagination
- **Overlays**: Modal, Sheet (side panel), Dropdown
- **Media**: Avatar, Image, Icon

## 📱 Pages

The kit includes several pre-built pages:

- **Authentication**: Login, Register, Forgot Password
- **E-commerce**: Product Listings, Product Details, Cart, Checkout
- **Dashboard**: Analytics, User Management
- **Settings**: Profile, Password, Appearance
- **User**: Favorites, Orders

## 🎨 Theming

UI Kit supports both light and dark themes, with a system preference option. Theme settings can be changed via:

- Settings page
- Theme toggle in the header

Themes are implemented using CSS variables, making customization straightforward.

## ⚡ Real-time Features

The project includes WebSocket integration with Laravel Reverb, providing real-time capabilities:

- Real-time notifications
- Live updates
- Chat functionality (framework ready)

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Start development server with SSR
npm run dev:ssr

# Build for production
npm run build

# Build for production with SSR
npm run build:ssr

# Lint code
npm run lint

# Type check
npm run types

# Format code
npm run format
```

## 📁 Project Structure

```
ui-kit/
├── app/                # Laravel backend code
├── config/             # Laravel configuration
├── database/           # Migrations and seeders
├── public/             # Public assets
├── resources/
│   ├── css/            # CSS files (Tailwind)
│   ├── js/
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── layouts/    # Page layouts
│   │   ├── lib/        # Utility functions
│   │   ├── pages/      # Page components
│   │   ├── stores/     # State management
│   │   └── types/      # TypeScript type definitions
│   └── views/          # Blade templates
├── routes/             # Laravel routes
└── vendor/             # Composer packages
```

## 🚢 Deployment

For production deployment:

1. Install dependencies:

```bash
composer install --optimize-autoloader --no-dev
npm ci
```

2. Build assets:

```bash
npm run build:ssr
```

3. Optimize Laravel:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📜 License

This project is licensed under the MIT License.

## 🙏 Acknowledgements

- [Laravel](https://laravel.com)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) - Component inspiration
- [Inertia.js](https://inertiajs.com)
- [Lucide Icons](https://lucide.dev)
- [Radix UI](https://www.radix-ui.com)
