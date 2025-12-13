# GlycoShield Carousel Component

A beautiful, fully-featured carousel component for displaying GlycoShield methodology slides with glassmorphism aesthetics.

## ✨ Features

### 🎨 Visual Design
- **Glassmorphism Design**: Matches GLACIER platform's signature glass aesthetic
- **Smooth Animations**: Spring-based transitions with Framer Motion
- **Gradient Overlays**: Subtle purple gradient to enhance traditional PPT slides
- **Responsive Layout**: 16:9 aspect ratio with container queries

### 🎬 User Interactions
- **Auto-play**: 8-second interval with progress bar
- **Drag to Navigate**: Swipe left/right on any device
- **Arrow Navigation**: Left/right arrow buttons with hover effects
- **Keyboard Support**: Use arrow keys to navigate
- **Pause on Hover**: Automatic pause when mouse enters carousel
- **Dot Indicators**: Click any dot to jump to specific slide
- **Pause/Play Toggle**: Manual control over auto-play

### 🎯 User Experience
- **Slide Counter**: Shows current slide / total slides
- **Animated Progress Bar**: Visual indicator of auto-play progress
- **Smooth Transitions**: Scale and fade animations between slides
- **Navigation Hints**: Keyboard and interaction instructions below carousel

## 📁 File Structure

```
frontend/
├── components/
│   └── carousel/
│       ├── GlycoShieldCarousel.tsx  # Main carousel component
│       └── index.ts                  # Export barrel
└── app/
    └── glycoshield/
        └── page.tsx                  # Updated with carousel
```

## 🎨 Design Elements

### Colors
- **Primary**: `#8B7DFF` (Purple - matches GlycoShield branding)
- **Background**: Glassmorphism with white/transparency
- **Text**: Black with various opacities

### Animations
- **Slide Transitions**: Spring animation (stiffness: 300, damping: 30)
- **Opacity**: 0.3s ease for fade effects
- **Scale**: 0.3s ease for zoom effects
- **Progress Bar**: Linear 8s animation

### Interactive Elements
- **Arrow Buttons**: 
  - Glassmorphic circles with blur
  - Scale on hover (1.1x)
  - Icon translation on hover
  
- **Dot Indicators**:
  - Active indicator has animated ring (layoutId)
  - Scale on active (1.25x)
  - Hover effects for inactive dots

## 🚀 Usage

```tsx
import { GlycoShieldCarousel } from '@/components/carousel'

// Default: 8-second auto-play
<GlycoShieldCarousel />

// Custom duration: 10 seconds
<GlycoShieldCarousel autoPlayDuration={10000} />
```

## 🖼️ Image Requirements

Images should be placed in:
```
public/assets/images/glcyoshield/
├── Slide1.png
├── Slide2.png
├── Slide3.png
├── Slide4.png
├── Slide5.png
├── Slide6.png
├── Slide7.png
└── Slide8.png
```

**Recommended Specs:**
- Format: PNG (with transparency support)
- Aspect Ratio: 16:9
- Resolution: 1920x1080 or higher
- Optimization: Use Next.js Image optimization if needed

## ⌨️ Keyboard Controls

- `←` Left Arrow: Previous slide
- `→` Right Arrow: Next slide
- `Mouse Hover`: Pause auto-play
- `Mouse Leave`: Resume auto-play

## 📱 Responsive Behavior

- **Desktop**: Full carousel with all controls
- **Tablet**: Maintains 16:9 ratio, touch-friendly buttons
- **Mobile**: Swipe gestures work perfectly, scaled buttons

## 🎭 Animation Details

### Slide Entry/Exit
```typescript
enter: (direction) => ({
  x: direction > 0 ? 1000 : -1000,
  opacity: 0,
  scale: 0.9
})

exit: (direction) => ({
  x: direction < 0 ? 1000 : -1000,
  opacity: 0,
  scale: 0.9
})
```

### Active Indicator
Uses Framer Motion's `layoutId` for smooth morphing between dots.

## 🔧 Customization

### Change Auto-play Duration
```tsx
<GlycoShieldCarousel autoPlayDuration={12000} /> // 12 seconds
```

### Modify Colors
Edit the component and change:
- `#8B7DFF` - Primary color
- Gradient overlays in the image container
- Button backgrounds

### Add More Slides
Simply add images to the array in the component:
```typescript
const slides = [
  // ... existing slides
  {
    src: '/assets/images/glcyoshield/Slide9.png',
    alt: 'GlycoShield New Topic - Slide 9'
  }
]
```

## 🎯 Performance

- **Lazy Loading**: Images load on-demand
- **Hardware Acceleration**: CSS transforms for smooth animations
- **Optimized Re-renders**: useCallback for event handlers
- **Clean-up**: Proper timer and event listener cleanup

## 🐛 Known Limitations

1. Drag may conflict with text selection on slides with text
2. Very fast swiping might skip slides
3. Images should be pre-optimized for web

## 🔮 Future Enhancements

- [ ] Add full-screen mode
- [ ] Thumbnail navigation
- [ ] Captions/descriptions per slide
- [ ] Zoom functionality
- [ ] Download slide button
- [ ] Share specific slide

## 📝 License

Part of the GLACIER platform - SimBioSys Lab, Northeastern University
