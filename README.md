# Chidozie Nnachor - Software Engineer Portfolio

> Modern portfolio website showcasing software engineering expertise, built with Next.js and deployed on Vercel.

## 🚀 Live Site
- **Production**: [https://chidozie-nnachor.vercel.app](https://chidozie-nnachor.vercel.app) *(coming soon)*
- **Current**: [https://odogwudozilla.github.io](https://odogwudozilla.github.io) *(legacy site)*

## 📋 Project Overview

This repository contains my professional portfolio website, currently undergoing a complete migration from a static HTML/Bootstrap site to a modern Next.js application. The portfolio serves as a showcase of my software engineering experience, technical skills, and professional projects.

### Current Status: **Migration in Progress**
- **Phase**: Foundation & Infrastructure Setup
- **Migration Goal**: Modern, performant, and maintainable portfolio with blog capabilities
- **Timeline**: 9-week phased migration (see [roadmap](./docs/roadmap.md))

## 🛠️ Technology Stack

### Current (Legacy)
- Static HTML/CSS with Bootstrap
- GitHub Pages hosting
- Basic responsive design

### Target (New Architecture)
- **Frontend**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS + ShadCN UI components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Resend for transactional emails
- **Deployment**: Vercel with preview environments
- **CMS**: Custom admin interface for content management

## 📁 Project Structure

```
├── docs/                     # Comprehensive project documentation
│   ├── productContext.md     # Project goals and target audience
│   ├── technicalArchitecture.md  # Technical stack and architecture
│   ├── developmentGuide.md   # Development workflow and standards
│   ├── roadmap.md           # Migration timeline and milestones
│   └── contentStrategy.md   # Content and SEO strategy
├── src/                     # Legacy source files (to be migrated)
└── .github/                 # GitHub workflows and configurations
    └── copilot-instructions.md  # AI assistant coding guidelines
```

## 🎯 Key Features (Planned)

### Core Portfolio Features
- ✅ Professional summary and experience timeline
- ✅ Skills showcase with interactive elements
- ✅ Project portfolio with detailed case studies
- 🔄 Responsive, accessible design system
- 🔄 Dark mode support

### Enhanced Features (Coming Soon)
- 📝 Technical blog with MDX support
- 📧 Contact forms with email integration
- 📊 Newsletter subscription system
- 🔍 Advanced search and filtering
- 📱 Progressive Web App capabilities

### Future Enhancements
- 🤖 AI-powered content recommendations
- 💬 Interactive chatbot for visitor engagement
- 🔐 Authentication for premium content
- 📈 Advanced analytics and performance monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control
- Supabase CLI (for database management)

### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/Odogwudozilla/odogwudozilla.github.io.git
cd odogwudozilla

# Install dependencies (once Next.js migration begins)
npm install

# Environment setup
cp .env.example .env.local
# Configure environment variables

# Start development server
npm run dev
```

## 📖 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[Product Context](./docs/productContext.md)**: Project objectives, target audience, and success metrics
- **[Technical Architecture](./docs/technicalArchitecture.md)**: Technology stack, database design, and security
- **[Development Guide](./docs/developmentGuide.md)**: Coding standards, testing, and deployment workflow
- **[Project Roadmap](./docs/roadmap.md)**: Migration timeline and feature development phases
- **[Content Strategy](./docs/contentStrategy.md)**: Blog content planning and SEO optimization

## 🔄 Migration Progress

### ✅ Completed
- [x] Project planning and documentation
- [x] Technology stack selection
- [x] Architecture design
- [x] Development workflow establishment

### 🔄 In Progress
- [ ] Next.js project initialization
- [ ] Component library development
- [ ] Content migration

### 📅 Upcoming
- [ ] Blog functionality implementation
- [ ] Contact forms and email integration
- [ ] SEO optimization
- [ ] Performance testing and optimization

See the complete [migration roadmap](./docs/roadmap.md) for detailed timelines.

## 🎨 Design Philosophy

### Modular Architecture
- **Atomic Design**: Components organized as atoms → molecules → organisms
- **Reusability**: Every UI element designed for maximum reuse
- **Type Safety**: Full TypeScript implementation with no 'any' types
- **Accessibility**: WCAG 2.1 AA compliance from the ground up

### Performance First
- **Core Web Vitals**: Target Lighthouse scores > 95
- **Bundle Optimization**: Sub-250KB initial bundle size
- **Image Optimization**: WebP formats with responsive sizing
- **Progressive Enhancement**: Works without JavaScript

## 🤝 Development Approach

This project is developed using AI-assisted development practices:

- **GitHub Copilot**: Primary development assistant following [coding guidelines](./.github/copilot-instructions.md)
- **Component-First**: Every feature built as reusable, documented components
- **Test-Driven**: Comprehensive testing strategy with high coverage requirements
- **Performance-Focused**: Continuous monitoring and optimization

## 🔗 Professional Links

- **LinkedIn**: [Chidozie Nnachor](https://www.linkedin.com/in/chidoziennachor/)
- **GitHub**: [Odogwudozilla](https://github.com/Odogwudozilla)
- **Current Portfolio**: [odogwudozilla.github.io](https://odogwudozilla.github.io)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**About Me**: Software Engineer at Keylane with expertise in enterprise software development, insurance technology, and full-stack web applications. Passionate about clean code, performance optimization, and collaborative development practices.
