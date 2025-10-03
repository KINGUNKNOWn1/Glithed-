// Hacker simulation code snippets
const codeSnippets = [
    'Initializing secure connection...',
    'Bypassing firewall [████████] 100%',
    'Decrypting RSA-2048 encryption...',
    'Accessing mainframe database...',
    'Injecting payload into target system...',
    'Establishing backdoor connection...',
    'Downloading classified files...',
    'Cracking SHA-256 hash...',
    'Exploiting zero-day vulnerability...',
    'Gaining root access...',
    'Uploading trojan executable...',
    'Scanning network ports: 21, 22, 80, 443, 3389',
    'SQL injection successful...',
    'Privilege escalation in progress...',
    'Disabling security protocols...',
    'Packet sniffing initiated...',
    'AES-256 key extracted successfully',
    'Brute forcing admin credentials...',
    'Cross-site scripting attack deployed',
    'Kernel exploitation completed',
    'WARNING: Intrusion detection system triggered',
    'Deploying countermeasures...',
    'Erasing digital footprints...',
    'Connection secured through TOR network',
    'Blockchain transaction traced',
    'Quantum encryption bypassed',
    'AI defense system neutralized',
    'Access granted: Level 5 clearance',
];

const hexCodes = [
    '0x7F45A3B9', '0x2E8D1C4F', '0x9B3A7E21', '0x4C6F8A1D',
    '0xE1D4B7C3', '0x5A2F9E84', '0xC7B3D145', '0x8E4A2C9F',
];

// Terminal output
const output = document.getElementById('output');
let currentText = '';
let isTyping = false;

// Add line to terminal
function addLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `output-line ${className}`;
    line.textContent = text;
    output.appendChild(line);
    output.parentElement.scrollTop = output.parentElement.scrollHeight;
}

// Simulate typing
function typeCode() {
    if (isTyping) return;
    isTyping = true;

    const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    let index = 0;

    const interval = setInterval(() => {
        if (index < snippet.length) {
            currentText += snippet[index];
            index++;
        } else {
            addLine(snippet);
            currentText = '';
            isTyping = false;
            clearInterval(interval);

            // Random chance to trigger special effects
            const rand = Math.random();
            if (rand > 0.7) {
                triggerGlitch();
            } else if (rand > 0.85) {
                showAccessMessage(Math.random() > 0.5);
            }
        }
    }, 30 + Math.random() * 50);
}

// Handle input field
const terminalInput = document.getElementById('terminalInput');

terminalInput.addEventListener('input', (e) => {
    typeCode();
});

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const inputValue = terminalInput.value.trim().toUpperCase();

        // Check if user input matches the current code
        if (inputValue === currentCode) {
            addLine(`> ${inputValue}`, 'user-input');
            addLine('✓ CODE ACCEPTED! Accessing secure system...', 'success');
            showAccessMessage(true);
            terminalInput.disabled = true;
            setTimeout(() => {
                window.location.href = 'secure.html';
            }, 2500);
        } else if (inputValue.length > 0) {
            addLine(`> ${inputValue}`, 'user-input');
            addLine('✗ INVALID CODE! Access denied.', 'error');
            showAccessMessage(false);
            terminalInput.value = '';
        }
    } else if (e.key === 'Escape') {
        clearTerminal();
        terminalInput.value = '';
    }
});

// Auto-start typing
setInterval(() => {
    if (!isTyping && Math.random() > 0.7) {
        typeCode();
    }
}, 1000);

// Clear terminal
function clearTerminal() {
    output.innerHTML = '';
    addLine('Terminal cleared...', 'system-msg');
}

// Encryption simulation - Code challenge
const encryptProgress = document.getElementById('encryptProgress');
const encryptOutput = document.getElementById('encryptOutput');
let currentCode = '';
let userInput = '';

function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function updateEncryption() {
    currentCode = generateRandomCode();
    encryptOutput.innerHTML = `<div style="font-size: 24px; font-weight: bold; color: #ff0000; text-align: center; margin-top: 20px; text-shadow: 0 0 10px #ff0000;">CODE: ${currentCode}</div>`;

    const progress = Math.floor(Math.random() * 100);
    encryptProgress.style.width = progress + '%';
}

// Generate new code every 15 seconds
setInterval(updateEncryption, 15000);
updateEncryption(); // Generate first code immediately

// System monitor simulation
function updateMonitor() {
    document.getElementById('cpu').textContent = (Math.random() * 100).toFixed(1) + '%';
    document.getElementById('ram').textContent = (50 + Math.random() * 50).toFixed(1) + '%';
    document.getElementById('net').textContent = (Math.random() * 999).toFixed(1) + ' MB/s';
}

setInterval(updateMonitor, 1000);

// Glitch effect
function triggerGlitch() {
    const glitch = document.getElementById('glitchOverlay');
    glitch.classList.add('glitch-active');
    setTimeout(() => {
        glitch.classList.remove('glitch-active');
    }, 300);
}

// Access message overlay
function showAccessMessage(granted) {
    const overlay = document.getElementById('accessOverlay');
    const text = overlay.querySelector('.access-text');

    if (granted) {
        text.textContent = 'ACCESS GRANTED';
        text.className = 'access-text access-granted';
    } else {
        text.textContent = 'ACCESS DENIED';
        text.className = 'access-text access-denied';
    }

    overlay.classList.remove('hidden');

    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 2000);
}

// Draggable windows
let draggedElement = null;
let offset = { x: 0, y: 0 };

document.querySelectorAll('.window-header').forEach(header => {
    header.addEventListener('mousedown', (e) => {
        draggedElement = header.parentElement;
        const rect = draggedElement.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
        draggedElement.style.zIndex = 100;
    });
});

document.addEventListener('mousemove', (e) => {
    if (draggedElement) {
        draggedElement.style.left = (e.clientX - offset.x) + 'px';
        draggedElement.style.top = (e.clientY - offset.y) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    if (draggedElement) {
        draggedElement.style.zIndex = 10;
        draggedElement = null;
    }
});

// Window controls
document.querySelectorAll('.control.close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const window = btn.closest('.window');
        window.style.display = 'none';
        setTimeout(() => {
            window.style.display = 'block';
        }, 3000);
    });
});

document.querySelectorAll('.control.minimize').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const window = btn.closest('.window');
        const content = window.querySelector('.window-content');
        if (content.style.display === 'none') {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });
});

// Random glitches
setInterval(() => {
    if (Math.random() > 0.8) {
        triggerGlitch();
    }
}, 5000);

// Initial messages
setTimeout(() => {
    addLine('System initialized successfully', 'success');
    addLine('Cyberpunk OS v2.4.7 - Loaded', 'success');
    addLine('Type anything to begin hacking simulation...', 'info');
}, 500);

// Matrix Rain Effect
const matrixCanvas = document.getElementById('matrixCanvas');
const matrixCtx = matrixCanvas.getContext('2d');

function resizeMatrixCanvas() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    // Reinitialize drops when resizing
    const cols = Math.floor(matrixCanvas.width / matrixFontSize);
    while (matrixDrops.length < cols) {
        matrixDrops.push(Math.random() * -100);
    }
    while (matrixDrops.length > cols) {
        matrixDrops.pop();
    }
}

const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const matrixFontSize = 20;
const matrixDrops = [];

// Initialize canvas and drops
resizeMatrixCanvas();
window.addEventListener('resize', resizeMatrixCanvas);

function drawMatrix() {
    // Darker fade for longer trails
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    const cols = Math.floor(matrixCanvas.width / matrixFontSize);
    for (let i = 0; i < cols; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));

        // Brighter head of the rain
        const y = matrixDrops[i] * matrixFontSize;

        // Draw bright character at head
        matrixCtx.fillStyle = '#0F0';
        matrixCtx.font = `${matrixFontSize}px monospace`;
        matrixCtx.fillText(text, i * matrixFontSize, y);

        // Add glow effect
        matrixCtx.shadowBlur = 8;
        matrixCtx.shadowColor = '#0F0';
        matrixCtx.fillText(text, i * matrixFontSize, y);
        matrixCtx.shadowBlur = 0;

        if (matrixDrops[i] * matrixFontSize > matrixCanvas.height && Math.random() > 0.975) {
            matrixDrops[i] = 0;
        }
        matrixDrops[i]++;
    }
}

setInterval(drawMatrix, 50);
