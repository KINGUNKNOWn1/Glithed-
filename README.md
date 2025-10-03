# Cyberpunk Hacker Simulator

A cyberpunk-themed interactive hacker simulation website with Matrix-style digital rain effects and multi-level security challenges.

## Features

- **Matrix Digital Rain Background**: Animated falling characters with Japanese katakana and binary digits
- **Multi-Stage Access System**:
  - Level 1: Encryption module code challenge (15-second intervals)
  - Level 2: System logs security code verification (15-second intervals)
  - Level 3: Full access granted screen
- **Interactive Windows**: Draggable terminal, encryption module, and system monitor
- **Real-time Animations**:
  - Live system monitoring (CPU, RAM, Network)
  - Dynamic encryption progress
  - Scrolling system logs and network traffic
- **Cyberpunk Aesthetics**: Green terminal colors, glowing effects, and hacker-style UI

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd sakura
```

2. Open `index.html` in your web browser, or start a local server:
```bash
python -m http.server 8000
```

3. Navigate to `http://localhost:8000`

## How to Use

1. **Main Page (index.html)**:
   - Watch the ENCRYPTION_MODULE for a 6-character code (changes every 15 seconds)
   - Type the code in the terminal input field
   - Press Enter to submit
   - If correct, you'll be redirected to the secure system

2. **Secure Page (secure.html)**:
   - Monitor the SYSTEM LOGS panel for red security codes (appear every 15 seconds)
   - Enter the code in the DATABASE ACCESS input field
   - Press Enter to verify
   - If correct, you'll access the final page

3. **Final Page (final.html)**:
   - Success screen showing full system access
   - Return to start to play again

## Files

- `index.html` - Main entry page with code challenge
- `secure.html` - Second level security page
- `final.html` - Success/completion page
- `style.css` - Cyberpunk styling and animations
- `script.js` - Interactive functionality and matrix rain effect
- `plan.md` - Project planning document

## Technologies Used

- HTML5 Canvas for Matrix rain animation
- CSS3 animations and effects
- Vanilla JavaScript (no frameworks)
- Responsive design

## Customization

You can customize:
- Code generation interval (default: 15 seconds)
- Matrix rain speed and characters
- Color schemes (currently green cyberpunk theme)
- Window positions and sizes

## License

MIT License - Feel free to use and modify

## Credits

Matrix rain effect inspired by [SynthRain](https://github.com/Saganaki22/SynthRain)
