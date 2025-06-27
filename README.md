# Task Manager App

A modern, responsive task management application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- 🔐 **Google Authentication** - Secure sign-in with Google OAuth
- ✅ **Task Management** - Create, edit, delete, and toggle task completion
- 📅 **Due Dates** - Set and track task due dates with calendar picker
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS
- 🔄 **Real-time Sync** - Tasks automatically sync across devices
- 🔒 **Secure** - Row-level security ensures users only see their own tasks

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Supabase (Database + Authentication)
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- Supabase account
- Google Cloud Console account (for OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-manager-app.git
cd task-manager-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

Follow the detailed setup guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── AuthPage.tsx      # Authentication page
│   ├── CreateTaskDialog.tsx
│   ├── TaskCard.tsx
│   └── ...
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom React hooks
│   ├── useTasks.ts       # Local task management
│   └── useSupabaseTasks.ts # Supabase task operations
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
    ├── database.ts       # Supabase database types
    └── task.ts          # Task interface
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables for Production

Make sure to add these in your Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔒 Security

- **Row Level Security (RLS)** enabled on all database tables
- **Google OAuth** for secure authentication
- **Environment variables** for sensitive data
- **User isolation** - users can only access their own tasks

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components built on top of Radix UI:

- Button, Card, Dialog, Dropdown Menu
- Calendar, Checkbox, Form, Input, Label
- Popover and more

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.
