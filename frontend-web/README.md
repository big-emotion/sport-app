# Sport App Landing Page

A modern, responsive landing page for a sports application built with Next.js, React, and Tailwind CSS. This project features internationalization support and follows best practices for modern web development.

## 🚀 Features

- ⚡ Next.js 15 with App Router
- 🎨 Tailwind CSS for styling
- 🌐 Internationalization (i18n) support with next-intl
- 📱 Fully responsive design
- 🎭 Framer Motion animations
- 🔍 ESLint and Prettier for code quality
- 🐶 Husky for Git hooks
- 📦 TypeScript for type safety

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **i18n**: next-intl
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sport-app-landing.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Project Structure

```
sport-app-landing/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # Reusable React components
│   ├── i18n/         # Internationalization files
│   └── middleware.ts # Next.js middleware
├── public/           # Static assets
└── messages/         # Translation files
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔧 Development

### Code Quality

This project uses ESLint and Prettier for code quality and formatting. Run the following commands to ensure code quality:

```bash
npm run lint  # Check for linting errors
npm run format # Format code
```

## Deployment

### Vercel CLI

To run the project locally with Vercel:
```bash
# Install Vercel CLI globally
npm i -g vercel

# Run the development server
vercel dev
```

### Vercel Deployment

The project is deployed on Vercel with the following setup:

- **Production**: Main branch is deployed to [https://sport-app-landing.vercel.app/fr](https://sport-app-landing.vercel.app/fr)
- **Preview**: All branches pushed to GitHub automatically trigger preview deployments
- **Development**: Use `vercel dev` for local development

### GitHub Integration

This project is linked to the BIG EMOTION GitHub repository. All pushes to the repository will trigger automatic deployments:
- Main branch → Production
- Feature branches → Preview deployments

### Git Hooks

Git hooks are set up using Husky to ensure code quality before commits.

## 📝 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
