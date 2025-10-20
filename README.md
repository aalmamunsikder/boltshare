# BoltShare - Enhanced P2P File Sharing Platform

![BoltShare](https://img.shields.io/badge/BoltShare-P2P%20File%20Sharing-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![WebRTC](https://img.shields.io/badge/WebRTC-P2P%20Technology-333333?style=for-the-badge&logo=webrtc)

## 🚀 Overview

BoltShare is a cutting-edge peer-to-peer (P2P) file sharing application that enables direct browser-to-browser file transfers without server intermediation. Built with modern web technologies and enhanced with beautiful UI/UX, it provides secure, real-time file sharing and chat functionality with a sleek, intuitive interface.

## ✨ Enhanced Features

### 🎨 Modern UI/UX Design
- **Glass Morphism Effects**: Beautiful backdrop blur and transparency effects
- **Animated Backgrounds**: Floating blob animations for visual appeal
- **Gradient Designs**: Modern gradient color schemes throughout
- **Micro-interactions**: Smooth hover effects and transitions
- **Responsive Design**: Optimized for all device sizes
- **Dark/Light Theme Ready**: Prepared for theme switching

### 🔄 Peer-to-Peer Technology
- **Direct Connection**: Files transfer directly between browsers using WebRTC
- **No Server Storage**: Your files never touch our servers - they go straight from peer to peer
- **Lightning Fast**: Transfer speeds limited only by your internet connection
- **Secure**: End-to-end encryption ensures your data remains private

### 💬 Enhanced Real-time Communication
- **Live Chat**: Beautiful chat bubbles with gradient designs
- **Connection Status**: Real-time indicators with animated elements
- **Room System**: Create secure rooms with unique IDs for private sharing
- **User Avatars**: Colorful gradient avatars for each user

### 🛠 Advanced Features
- **Connection Diagnostics**: Built-in troubleshooting tools
- **Automatic Reconnection**: Smart retry logic with exponential backoff
- **Progress Tracking**: Beautiful animated progress bars for file transfers
- **Browser Compatibility**: Works on Chrome, Firefox, and Edge
- **Mobile Responsive**: Fully functional on all device sizes
- **Drag & Drop**: Enhanced file upload with visual feedback

### 🔐 Security & Reliability
- **User Authentication**: Secure signup/login with enhanced forms
- **Input Validation**: Comprehensive security measures with visual feedback
- **Error Recovery**: Graceful handling of network issues
- **Row Level Security**: Database access controls
- **Password Strength**: Real-time password validation with visual indicators

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom animations
- **P2P Technology**: WebRTC
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime + WebRTC DataChannels
- **Authentication**: Supabase Auth
- **Build Tools**: Vite + PostCSS
- **Icons**: Lucide React
- **State Management**: Zustand

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aalmamunsikder/boltshare.git
   cd boltshare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new project in Supabase Dashboard
   - Run the SQL migrations in the `supabase/migrations/` directory
   - Configure authentication settings

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### Creating a Room

1. Sign up or log in to your account
2. Click "Create Room" on the dashboard
3. Give your room a name and optionally set a password
4. Share the room ID with your peer

### Joining a Room

1. Enter the room ID provided by your peer
2. Click "Join Room"
3. Enter password if required
4. Wait for the P2P connection to establish

### Sharing Files

1. Once connected, drag and drop files or click the upload button
2. Files are transferred directly to your peer
3. Monitor progress with beautiful animated progress bars
4. Chat with your peer while files transfer

## 🎨 UI/UX Enhancements

### Landing Page
- Hero section with animated background blobs
- Feature cards with hover animations
- Gradient text effects
- Call-to-action buttons with micro-interactions

### Authentication Pages
- Glass morphism login/signup forms
- Password strength indicators
- Animated form validation
- Beautiful error states

### Dashboard
- Enhanced room cards with hover effects
- Animated loading states
- Gradient buttons and icons
- Improved empty states

### Room Interface
- Beautiful chat bubbles
- Animated file transfer cards
- Enhanced drag-and-drop zones
- Improved user sidebar with avatars

## 🔧 Development

### Project Structure

```
boltshare/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── landing/        # Landing page components
│   │   └── room/           # Room-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # External library configurations
│   ├── store/              # State management
│   └── index.css           # Global styles and animations
├── supabase/
│   └── migrations/         # Database migrations
└── public/                 # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Vercel Deployment

The project includes a `vercel.json` configuration file for easy deployment to Vercel:

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   Or connect your GitHub repository to Vercel for automatic deployments.

3. **Environment Variables**: Set the following in your Vercel dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Environment Variables

| Variable                  | Description                 | Required |
| ------------------------- | --------------------------- | -------- |
| VITE_SUPABASE_URL         | Your Supabase project URL   | ✅        |
| VITE_SUPABASE_ANON_KEY    | Your Supabase anonymous key | ✅        |

## 🐛 Troubleshooting

### Common Issues

**Connection Won't Establish**
- Check if both users are on supported browsers
- Ensure no firewall is blocking WebRTC
- Try the built-in diagnostics tool

**File Transfer Fails**
- Verify file size is reasonable (recommended < 100MB)
- Check network stability
- Ensure both users remain on the page

**Can't Join Room**
- Verify room ID is correct
- Check if room exists and is active
- Ensure you're logged in

### Debug Tools

The app includes comprehensive debugging:
- **Connection Diagnostics**: Settings icon → Diagnostics
- **Console Logs**: Detailed WebRTC logging
- **Network Tests**: Built-in connectivity checks

## 🤝 Contributing

We welcome contributions! Please see our Contributing Guide for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run lint && npm run type-check`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- WebRTC for enabling peer-to-peer connections
- Supabase for the backend infrastructure
- Tailwind CSS for the beautiful UI framework
- Lucide React for the beautiful icons
- Vite for the fast development experience

## 📞 Support

- 📧 Email: support@boltshare.dev
- 🐛 Issues: [GitHub Issues](https://github.com/aalmamunsikder/boltshare/issues)
- 📖 Documentation: [Wiki](https://github.com/aalmamunsikder/boltshare/wiki)

## 🔮 Roadmap

- [ ] Multi-user room support
- [ ] End-to-end encryption
- [ ] File preview functionality
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Advanced room settings
- [ ] File size limits and quotas
- [ ] Connection quality indicators
- [ ] Dark mode toggle
- [ ] Advanced animations
- [ ] Sound notifications

---

**Made with ❤️ by the BoltShare Team**

## 🌟 Recent Updates

### v2.0.0 - Enhanced UI/UX
- ✨ Complete UI/UX redesign with modern glass morphism effects
- 🎨 Animated background elements and micro-interactions
- 📱 Improved responsive design for all devices
- 🔐 Enhanced authentication forms with password strength indicators
- 💬 Beautiful chat interface with gradient designs
- 📁 Enhanced file transfer cards with animated progress bars
- 🎯 Improved user experience with better visual feedback

---

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aalmamunsikder/boltshare)
