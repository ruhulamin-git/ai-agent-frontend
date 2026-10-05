# AI Workforce Hub

A comprehensive platform for AI agent workforce management, featuring landing, pricing, registration, and login experiences.

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Configure your environment variables by copying `.env` to `.env.local`:

```bash
cp .env .env.local
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, Material-UI, Radix UI
- **State Management:** Redux Toolkit, React Query
- **Forms:** Formik, Yup, Zod
- **Rich Text:** TipTap
- **Charts:** ApexCharts
- **Code Editor:** CodeMirror

## Project Structure

```
├── app/              # Next.js App Router pages
├── src/              # Source code
│   ├── components/   # Reusable components
│   ├── modules/      # Feature modules
│   ├── services/     # API services
│   ├── store/        # Redux store
│   └── utils/        # Utility functions
├── public/           # Static assets
└── middleware.ts     # Next.js middleware
```

---

## 📄 License

This project is licensed under the MIT License.


<!-- Security scan triggered at 2026-09-05 07:37:42 -->