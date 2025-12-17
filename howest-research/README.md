# BAP - Bachelor Project: Interactive Research Portfolio

An interactive React Native application showcasing Howest research projects through an innovative dual-screen experience with 3D visualizations, holographic effects, and gesture-based interactions.

## 📋 Project Overview

This Bachelor Project (BAP) is an interactive portfolio application designed for Howest research projects. The application features:

- **Dual-Screen Display**: iPad main interface with external display support for holographic visualizations
- **3D Grid**: Navigate through research projects in an immersive 3D space using Three.js
- **Interactive Visualizations**: Dynamic cluster and keyword-based project categorization
- **Gesture-Based Navigation**: Touch and pinch gestures for intuitive exploration
- **Holographic images**: Animated WEBP-based hologram visualizations for project presentations

## 🌿 Development Branches

The project utilized multiple feature branches for parallel development:

- **main** - Production-ready code with merged features
- **threeJS** - 3D visualization experiments and Three.js integration
- **infiniteGrid-threeJS** - Infinite grid implementation with Three.js
- **Projects-infiniteScroll** - Infinite scroll for project cards
- **Demo-infiniteScroll** - Demo version of infinite scrolling
- **styling** - UI styling and visual design iterations
- **clusterImages** - Cluster image generation and management
- **hologram-visualisations** - Holographic animation effects
- **multiple-screens** - Multi-screen (iPad + external display) functionality
- **User-test-2** - SOTA for User testing iteration 2
---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for macOS) or Android Studio (for Android development)

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jana-Elst/BAP.git
   cd BAP
   ```

2. **Navigate to the main application:**
   ```bash
   cd howest-research
   ```

3. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Run image generation scripts (if needed):**
   ```bash
   node scripts/run-all-script
   ```

5. **Open Xcode:**
   ```bash
   xed ios
   ```

6. **Start the development server:**
   ```bash
   npx expo start
   ```

---

## 🎮 Features

### Multi-Screen Experience
- **iPad Interface**: Main touchscreen interface for navigation and interaction
- **External Display**: Secondary display for holographic project visualizations
- **Synchronized States**: Real-time synchronization between both displays

### Navigation Modes
- **Discover Mode**: Infinite 3D grid exploration with gesture controls
- **Gallery Mode**: Structured view of all projects
- **Detail View**: Comprehensive project information with images and descriptions
- **Cluster View**: Projects organized by research clusters
- **Keyword View**: Projects categorized by keywords

### Interactive Elements
- **Touch Gestures**: Pan, pinch-to-zoom, and tap interactions
- **Floating Animations**: Dynamic 3D object movements
- **Holographic Effects**: WEBP-based animated visualizations
- **Smooth Transitions**: GSAP-powered page transitions
- **Loading States**: Shimmer effects for better UX

### Visual Features
- **Custom Fonts**: VAGRoundedStd and OpenSans
- **Dynamic Colors**: Project-specific color schemes
- **Gradient Effects**: Linear and radial gradients
- **SVG Icons**: Scalable vector graphics
- **Texture Overlays**: Enhanced visual depth, we tried, but did'nt succeed

---

## 🎨 Image Generation System

The project includes automated Node.js scripts for generating project visualizations:

Located in `howest-research/scripts/`:
- `create-images.js` - Generates project images with compositions
- `create-cluster-images.js` - Creates cluster visualization images
- `create-keyword-images.js` - Generates keyword-specific images
- `generate-image-imports.js` - Creates TypeScript imports for all images
- `ccreate_webp_aniamtions.js` - Creates WEBP animations for the hologram
- `generate-all.js` - Runs all generation scripts in sequence

Run all scripts at once:
```bash
cd howest-research
node scripts/generate-all
```

---

## 🤝 Contributing

This is a Bachelor Project (BAP) repository developed as part of an academic thesis at Howest. 

**Note**: This project represents completed academic work. The repository is maintained for reference and portfolio purposes. While the codebase is available for viewing and learning, active contributions are not being accepted as this is a completed academic project.

For questions or discussions about the implementation, feel free to open an issue.

---

## 👨‍💻 Developer

**Jana Elst**
- GitHub: [@Jana-Elst](https://github.com/Jana-Elst)

---

## 📄 License

This project was developed as part of a Bachelor thesis at Howest.

---

## 🙏 Acknowledgments

- **Infinite Layers Grid** by [Jorge Toloza](http://jorgetoloza.co) - Base implementation for the infinite grid system
- **Codrops** - Tutorial and inspiration for the infinite parallax grid
- **Howest** - Research data and project information
- **Gemini 3 PRO** - My virtual assistant, teacher, sparring partner, ...

---

## 📚 Additional Resources

### Related Projects
- The different branches of this repository represent different stages of the development process. If you want to see some demo's checkout some other branches.
They are not that clean, and named well, but they do show my progress.

### Documentation
For specific component documentation, see inline code comments and TypeScript type definitions.

### README
This readme file is created with the help of Copilot.

---

*Last Updated: December 17, 2025*