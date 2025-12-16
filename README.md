# BAP - Bachelor Project: Interactive Research Portfolio

An interactive React Native application showcasing Howest research projects through an innovative dual-screen experience with 3D visualizations, holographic effects, and gesture-based interactions.

## 📋 Project Overview

This Bachelor Project (BAP) is an interactive portfolio application designed for Howest research projects. The application features:

- **Dual-Screen Display**: iPad main interface with external display support for holographic visualizations
- **3D Infinite Grid**: Navigate through research projects in an immersive 3D space using Three.js
- **Interactive Visualizations**: Dynamic cluster and keyword-based project categorization
- **Gesture-Based Navigation**: Touch and pinch gestures for intuitive exploration
- **Holographic Effects**: Animated WEBP-based hologram visualizations for project presentations
- **QR Code Integration**: Quick access to detailed project information

## 🗂️ Repository Structure

```
BAP/
├── howest-research/          # Main React Native application
│   ├── app/                  # Application screens and routing
│   ├── components/           # React components
│   │   ├── atoms/           # Basic UI components
│   │   ├── organisms/       # Complex component compositions
│   │   ├── pages/           # Page-level components
│   │   └── screens/         # Screen components (iPad & External Display)
│   ├── assets/              # Images, fonts, and static resources
│   ├── constants/           # Application constants
│   ├── hooks/               # Custom React hooks
│   ├── scripts/             # Node.js scripts for image generation
│   └── styles/              # Global styles
├── infinite-layers-grid-main/ # Three.js infinite grid implementation
├── projectCard/              # 3D project card prototypes
└── tests/                    # Testing environments
```

## 🚀 Development Timeline

### Week 1 (December 2-3, 2025): Foundation & Infinite Grid

**December 2:**
- Created initial demo card with CSS styling
- Implemented infinite grid with Three.js cards
- Added background color and basic layout

**December 3:**
- Developed infinite scroll functionality in both directions
- Integrated project information retrieval system
- Optimized card creation and grid performance
- Added custom fonts (VAGRoundedStd and OpenSans)
- Enhanced InfiniteScrollHero component with dynamic project positioning
- Merged infinite grid features (PR #7, #8, #9)

---

### Week 2 (December 4-8, 2025): Styling & Image System

**December 4:**
- Installed Skia for advanced graphics rendering
- Implemented image display with ellipse bounding boxes
- Separated keyword and cluster image handling in ProjectImage component
- Integrated ProjectImage into ExternalScreen
- Merged cluster images feature (PR #11)
- Designed and styled header with icons using SVG loader
- Created and styled view button component
- Enhanced card styling and removed unused button components

**December 5:**
- Added correct images to filter components
- Experimented with texture application on cards
- Completed filter styling
- Finalized Howest research information display

**December 6:**
- Refactored 3D scene components to pass full project data
- Built comprehensive detail page layout
- Fixed blur view and carousel gap on detail page
- Added QR code generation and Card component
- Installed base64 decoding package for data handling
- Created dynamic image loading system
- Generated cluster images for various research areas
- Implemented keyword image display in projectImage
- Added marketingCommunicatie images and updated loading scripts
- Debugged cluster image loading issues
- Implemented tap gesture events on elements and clusters

**December 7:**
- Styled detailKeywordCard and filterCard large components
- Added error prevention for edge cases (positions === 0)
- Implemented page history with info property
- Fixed DiscoverScreen to fill entire screen
- Refined detailKeyword layout
- Positioned keyword labels accurately
- Added conditional keyword rendering with showKeywords prop
- Displayed correct visuals during detail page navigation
- Generated additional cluster and keyword images
- Enhanced image import scripts

**December 8:**
- Modified scripts for Node.js compatibility
- Implemented image display on detailKeyword screen
- Applied correct color schemes
- Debugged createProjectImageCompositionsNode script
- Successfully generated project images with working scripts
- Fixed Node scripts for cluster and keyword imports
- Added generation dates to scripts
- Created script for generating image paths
- Fixed bugs in image creation scripts
- Restored project file image generation
- Enhanced projectImageCompositions color handling
- Added custom fonts and colors to projectCard3D
- Integrated images into project keywordsLarge
- Cleaned up Card component (removed unused handleLayout)
- Merged styling improvements (PR #12)
- Added new WEBP cluster images
- Created WEBP animation system with generation script
- Removed console logs and added homescreen hologram animation

---

### Week 3 (December 9-10, 2025): Hologram Animations

**December 9:**
- Developed first animation sequence with looping WEBP
- Implemented first working transition animation
- Created animation start functionality
- Updated clusteroverschrijdend images
- Regenerated image imports with new float animation variables
- Generated and created new visualization images
- Completed idle animation for homescreen hologram

**December 10:**
- Refined animation with lag optimization (brake adjustments)
- Created first version of floating boxes visualization
- Added extra keyword visualizations
- Implemented correct image display for different states
- Created opacity fade in/out effects for clusters
- Developed flying-in animation for objects on detail page opening
- Enhanced flying animations
- Made small adjustments for testing
- Added more keyword images

---

### Week 4 (December 11-13, 2025): Restructuring & Polish

**December 11:**
- Merged hologram visualizations (PR #13)
- Added GSAP animation library for enhanced animations
- Rearranged homescreen layout
- Changed projectCard composition structure
- Fixed minor bugs and issues
- Refactored visibility handling with setVisible
- Attempted loading state optimization
- Created global loading state management
- Debugged loading state behavior

**December 12:**
- Fixed filtering bug affecting project display
- Added smooth transitions between states
- Identified need to rewrite cardsWorld component
- Implemented touch-based animated opacity for header and footer
- Restructured cardsWorld with new images
- Successfully restructured worldCards component
- Debugged filter application errors
- Corrected projectCard positioning
- Set maximum zoom-out value for better UX
- Added grid boundaries (debugging in progress)

**December 13:**
- Implemented correct limits for gridView
- Fixed filter functionality
- Added smooth transition animations
- Restored grid limit function
- Adjusted heroCanvas width to match internal elements
- Enhanced transition smoothness
- Created working title dissolve effect
- Removed gradient flickering issues
- Corrected gridView positioning
- Experimented with smooth scrolling (to verify in build)
- Added background texture to projectCard
- Removed limits for discoverMode
- Implemented additional animations throughout
- Added shimmer package for loading states
- Created fade-in effects for detail view
- Restructured projectImage component

---

### Week 5 (December 14-16, 2025): Final Polish & Optimization

**December 14:**
- Added tap animation for keywordImages
- Improved animation smoothness
- Synchronized loading states across components
- Added application icons
- Updated app.json with correct name
- Fixed file paths throughout the project
- Implemented smooth scroll on homescreen with icons
- Adjusted easing functions for better feel
- Debugged filter issues
- Changed filter header structure
- Refined small layout details
- Attempted font path fixes
- Refactored image composition with useMemo for performance
- Added sophisticated touch animations
- Made clusterImage components clickable
- Improved image loading performance
- Changed shimmer gradient color
- Restored hologram functionality
- Debugged pressable zone for clusters
- Removed debug visualization boxes
- Added keyword transition for clusterDetail

**December 15:**
- Created new function for keyword positions (debugging needed)
- Changed various small details
- Added SVG icons to interface

**December 16:**
- Styled complete homescreen
- Made minor adjustments
- Struggled with card texture implementation
- Refined detail page layout:
  - Removed images section
  - Added horizontal margins
  - Enhanced text component flexibility
  - Improved dynamic color and gradient usage
- Animated accordion component
- Implemented page reset after one minute of inactivity
- Changed title font in 3D card environment
- Created unified script to run all generation scripts
- Replaced filter implementations
- Cleaned up unused assets:
  - Removed old 3D models
  - Deleted example images
  - Removed unused fonts
  - Cleaned up 3D project card styling
  - Updated main stylesheet
- Removed old hologram visualization components
- Added animatedView prop to Card component
- Added borders to large cards
- Removed debug comments
- Created empty state handling
- Added info overlay functionality
- Fixed overlay bug

**December 17:**
- Merged final hologram visualizations (PR #15)

---

## 🛠️ Technologies Used

### Core Framework
- **React Native** (0.81.5) with **Expo** (~54.0.25)
- **TypeScript** (~5.9.2)
- **Expo Router** (~6.0.15) for navigation

### 3D Graphics & Animations
- **Three.js** (^0.181.2)
- **@react-three/fiber** (^9.4.0) - React renderer for Three.js
- **@react-three/drei** (^10.7.7) - Helper components for React Three Fiber
- **GSAP** (^3.14.1) with **@gsap/react** (^2.1.2) - Animation library
- **React Native Reanimated** (~4.1.1)

### Graphics & Image Processing
- **@shopify/react-native-skia** (^2.4.6) - 2D graphics rendering
- **Expo Image** (~3.0.10) - Optimized image handling
- **Sharp** (^0.34.5) - Image processing for Node.js scripts
- **Skia Canvas** (^3.0.8) - Canvas operations
- **Canvas** (^3.2.0) - Canvas API support

### UI Components & Styling
- **Expo Linear Gradient** (~15.0.7)
- **Expo Blur** (~15.0.7)
- **React Native Fast Shimmer** (^1.3.4) - Loading states
- **@rneui/themed** (^4.0.0-rc.8) - UI elements
- **React Native SVG** (15.12.1)

### Navigation & Gestures
- **React Native Gesture Handler** (~2.28.0)
- **React Native Reanimated Carousel** (^4.0.3)
- **React Native Pager View** (^7.0.1)
- **@shopify/flash-list** (2.0.2) - Optimized lists

### External Features
- **React Native External Display** (^0.6.6) - Multi-screen support
- **React Native QRCode SVG** (^6.3.20) - QR code generation
- **React Native WebView** (13.15.0)

### State Management
- **Zustand** (^5.0.8) - Lightweight state management

### Development Tools
- **ESLint** (^9.25.0) with expo config
- **Metro** bundler for React Native

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
   npm install
   ```

4. **Run image generation scripts (if needed):**
   ```bash
   npm run generate-all
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```

6. **Run on specific platform:**
   ```bash
   npm run ios      # iOS Simulator
   npm run android  # Android Emulator
   npm run web      # Web Browser
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
- **Texture Overlays**: Enhanced visual depth

---

## 🎨 Image Generation System

The project includes automated Node.js scripts for generating project visualizations:

Located in `howest-research/scripts/`:
- `create-images.js` - Generates project images with compositions
- `create-cluster-images.js` - Creates cluster visualization images
- `create-keyword-images.js` - Generates keyword-specific images
- `generate-image-imports.js` - Creates TypeScript imports for all images
- `generate-all.js` - Runs all generation scripts in sequence

Run all scripts at once:
```bash
cd howest-research
npm run generate-all
```

---

## 📱 Application Screens

### Home Screen (Idle State)
- Animated hologram visualization
- Touch-to-activate functionality
- Auto-reset after 60 seconds of inactivity

### Discover Screen
- Infinite 3D grid of project cards
- Gesture-based navigation (pan, zoom)
- Real-time filtering and search

### Detail Page
- Project title and description
- Research cluster information
- Keyword tags
- QR code for additional information
- Animated accordion sections

### Filter Screen
- Research cluster filters
- Keyword filters
- Visual filter cards with images

---

## 🧪 Testing Environments

The repository includes several testing directories:
- `tests/react-three-js` - Three.js integration tests
- `tests/react-three-js:native-imports` - Native module tests
- `tests/react-multiple-screens` - Multi-screen functionality tests
- `tests/react-tests` - General React component tests

---

## 🎯 Key Implementation Details

### Loading State Management
Global loading state using Zustand for synchronized loading indicators across iPad and external display.

### Animation System
- GSAP for smooth UI transitions
- React Native Reanimated for gesture-driven animations
- Custom WEBP animations for holographic effects

### Performance Optimizations
- `useMemo` for expensive image computations
- FlashList for efficient list rendering
- Optimized Three.js scene rendering
- Dynamic image loading with caching

### Gesture Handling
- React Native Gesture Handler for touch interactions
- Custom pan and pinch handlers for 3D navigation
- Touch-based opacity animations for UI elements

---

## 📝 Configuration

### App Configuration
Located in `howest-research/app.json`:
- App name and slug
- Platform-specific settings (iOS, Android, Web)
- Custom fonts configuration
- Splash screen settings
- Icon configurations

### TypeScript Configuration
Located in `howest-research/tsconfig.json`:
- Strict type checking enabled
- Path aliases for clean imports
- React Native type definitions

---

## 🤝 Contributing

This is a Bachelor Project repository. Development history shows iterative improvements over December 2025.

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

---

## 📚 Additional Resources

### Related Projects
- `infinite-layers-grid-main/` - Standalone infinite grid implementation
- `projectCard/` - 3D project card prototypes and experiments

### Documentation
For specific component documentation, see inline code comments and TypeScript type definitions.

---

*Last Updated: December 17, 2025*
