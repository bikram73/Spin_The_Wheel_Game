# 🎡 Spin The Wheel Game

An interactive web application that allows users to create customizable spinning wheels with dynamic entry management, image support, and results tracking.

## ✨ Features

### 🎡 Spinning Wheel
- **Smooth Canvas-based Animation**: Fast and responsive wheel rendering using HTML5 Canvas
- **Fair Random Selection**: Uniform probability distribution for fair outcome selection
- **Dynamic Segments**: Automatically adjusts to the number of entries
- **Visual Feedback**: Highlight pointer and smooth easing animation

### 📋 Entry Management
- **Add/Edit/Delete Entries**: Full CRUD operations on wheel entries
- **Duplicate Entries**: Quick way to create similar entries
- **Check/Uncheck**: Enable/disable entries from spinning
- **Shuffle & Sort**: Randomize or alphabetically organize entries
- **Image Support**: Attach images to individual entries (future enhancement)

### 📊 Results Tracking
- **Result History**: Track all spin outcomes with timestamps
- **Statistics**: View most common results
- **Sort Options**: Organize results by time or frequency
- **Clear History**: Reset results at any time

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Beautiful Animations**: Smooth transitions using Framer Motion
- **Gradient Design**: Modern glassmorphism aesthetic
- **Accessible Interface**: Intuitive controls and clear visual hierarchy

### ⚙️ Configuration
- **Editable Title & Description**: Customize wheel naming
- **Input Validation**: Prevents empty entries and edge cases
- **Smooth Transitions**: All interactions are animated

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+) and npm/yarn
- Modern web browser with HTML5 Canvas support

### Installation

1. **Clone or download the project**
   ```bash
   cd Spin_the_Wheel_Game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Typically at: `http://localhost:3000`
   - Auto-opens in your default browser

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## 📁 Project Structure

```
├── index.html           # HTML entry point
├── vite.config.js      # Vite configuration
├── package.json        # Project dependencies
│
└── src/
    ├── main.jsx           # React app entry
    ├── App.jsx            # Main app component with state management
    ├── styles.css         # Global styles with responsive design
    │
    └── components/
        ├── Wheel.jsx         # Canvas-based spinning wheel
        ├── EntriesPanel.jsx  # Entry management UI
        └── ResultsPanel.jsx  # Results display and tracking
```

## 🛠 Tech Stack

### Frontend Framework
- **React 18**: UI library for component-based development
- **Vite**: Fast build tool and dev server

### Animation & Visualization
- **HTML5 Canvas**: High-performance wheel rendering
- **Framer Motion**: Smooth component animations

### Utilities
- **UUID**: Unique ID generation for entries and results

### Styling
- **CSS3**: Modern styling with gradients, flexbox, and grid
- **Responsive Design**: Mobile-first approach

## 📖 Usage Guide

### Creating Your First Wheel

1. **Set Custom Title**
   - Click the wheel title to edit
   - Makes it personal and descriptive

2. **Set Description**
   - Click description text to customize
   - Add context for your wheel

3. **Add Entries**
   - Click the "➕ Add" button in the Entries panel
   - Edit by clicking on entry text
   - Add up to 100+ entries (tested for performance)

4. **Organize Entries**
   - **🔀 Shuffle**: Randomize entry order
   - **🔤 Sort**: Alphabetical sorting (A-Z or Z-A)
   - ✅ **Check/Uncheck**: Enable/disable individual entries

5. **Add Images (Future Enhancement)**
   - Click 🖼️ icon next to entry
   - Images can be displayed in wheel segments

6. **Spin the Wheel**
   - Ensure at least 1 entry is checked
   - Click "🎲 SPIN THE WHEEL"
   - Watch the smooth animation
   - Result appears after spinning

7. **View Results**
   - Results panel shows all spin outcomes
   - Top 3 most common results displayed
   - Sort results by time or frequency
   - Clear history when needed

## ⚙️ Component Details

### Wheel Component
- **Canvas-based**: Uses RequestAnimationFrame for smooth 60 FPS animation
- **Responsive**: Automatically resizes with window
- **Easing**: Cubic-out animation for natural deceleration
- **Touch-friendly**: Works with mouse and touch inputs

### EntriesPanel Component
- **Live Validation**: Prevents empty entries
- **Inline Editing**: Click to edit entry names
- **Image Upload**: File input for entry images
- **Smooth Animations**: Framer Motion for list item transitions

### ResultsPanel Component
- **Smart Statistics**: Automatically calculates most common results
- **Timestamp Tracking**: Records when each result occurred
- **Sort Flexibility**: Chronological or frequency-based sorting
- **Visual Feedback**: Rank display and occurrence badges

## 🎨 Customization

### Colors
Edit the color palette in `src/components/Wheel.jsx`:
```javascript
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', // ... add more colors
];
```

### Theme Colors
Modify primary colors in `src/styles.css`:
```css
--primary: #667eea;
--secondary: #764ba2;
```

### Animation Speed
Adjust spin duration in `src/App.jsx`:
```javascript
const spinDuration = 5; // seconds (change this value)
```

## 🔧 Advanced Features

### Edge Cases Handled
- ✅ **No Entries**: Spin button disabled automatically
- ✅ **Single Entry**: Auto-selects when only 1 active entry
- ✅ **All Unchecked**: Treats as no entries
- ✅ **Large Entry Count**: Optimized for 100+ entries
- ✅ **Duplicate Names**: Allowed and distinct

### Performance Optimizations
- Canvas drawing optimized with minimal redraws
- Efficient re-renders using React hooks
- Smooth 60 FPS animation with RequestAnimationFrame
- Responsive design prevents layout thrashing

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 🚀 Future Enhancements

- [ ] Sound effects 🎵
- [ ] Shareable wheel links
- [ ] Export results to CSV
- [ ] Dark/Light theme toggle
- [ ] Multiplayer mode
- [ ] Wheel customization (colors, fonts)
- [ ] Entry images in segments
- [ ] Weighted probability (some entries more likely)
- [ ] Backend persistence (MongoDB)
- [ ] User authentication

## 🐛 Troubleshooting

### Wheel not showing?
- Ensure entries are present and at least one is checked
- Check browser console for errors
- Clear browser cache

### Spin animation stuttering?
- Close other applications to free up resources
- Reduce number of open browser tabs
- Try a different browser

### Changes not appearing?
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear node_modules and reinstall: `npm install`

## 📄 License

MIT License - Free to use and modify

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 📧 Support

For issues or suggestions, open an issue in the project repository.

---

**Happy Spinning! 🎡**
