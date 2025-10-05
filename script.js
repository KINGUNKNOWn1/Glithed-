// Matrix Rain Effect with Purple/Blue Theme
const matrixCanvas = document.getElementById('matrixCanvas');
const matrixCtx = matrixCanvas.getContext('2d');

function resizeMatrixCanvas() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
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

resizeMatrixCanvas();
window.addEventListener('resize', resizeMatrixCanvas);

function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    const cols = Math.floor(matrixCanvas.width / matrixFontSize);
    for (let i = 0; i < cols; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        const y = matrixDrops[i] * matrixFontSize;

        // Purple/Blue gradient for matrix rain
        const colors = ['#9d4edd', '#c77dff', '#5a189a', '#7b2cbf'];
        matrixCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        matrixCtx.font = `${matrixFontSize}px monospace`;
        matrixCtx.fillText(text, i * matrixFontSize, y);

        matrixCtx.shadowBlur = 8;
        matrixCtx.shadowColor = '#c77dff';
        matrixCtx.fillText(text, i * matrixFontSize, y);
        matrixCtx.shadowBlur = 0;

        if (matrixDrops[i] * matrixFontSize > matrixCanvas.height && Math.random() > 0.975) {
            matrixDrops[i] = 0;
        }
        matrixDrops[i]++;
    }
}

setInterval(drawMatrix, 50);

// Token Data
const TOKEN_ADDRESS = 'CiMBEZ5BGtLiAj1Knyx323CjN6yxkxmstHNiEeKopump';
let previousMcap = 0;
let mcapMilestone = 0;

// Countries List with lat/long coordinates for 3D globe
const countries = [
    { id: 'usa', name: 'USA', flag: '🇺🇸', lat: 38, lon: -97 },
    { id: 'brazil', name: 'Brazil', flag: '🇧🇷', lat: -10, lon: -55 },
    { id: 'uk', name: 'UK', flag: '🇬🇧', lat: 54, lon: -2 },
    { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', lat: 9, lon: 8 },
    { id: 'china', name: 'China', flag: '🇨🇳', lat: 35, lon: 105 },
    { id: 'japan', name: 'Japan', flag: '🇯🇵', lat: 36, lon: 138 },
    { id: 'australia', name: 'Australia', flag: '🇦🇺', lat: -25, lon: 133 }
];

// Earth Globe Variables
let earthCanvas, earthCtx;
let earthRotation = 0;
const earthRadius = 180;
let animationFrame;

let currentCountryIndex = 0;
let unlockedCodes = [];
let totalRewardsEarned = 0;
let totalClaims = 0;

// Initialize
function init() {
    // Initialize Earth canvas
    earthCanvas = document.getElementById('earthCanvas');
    earthCtx = earthCanvas.getContext('2d');

    // Start Earth animation
    animateEarth();

    // Initialize country markers
    initCountryMarkers();

    fetchTokenData();
    setInterval(fetchTokenData, 3000);
}

// Initialize country markers on the globe
function initCountryMarkers() {
    const markersContainer = document.getElementById('countryMarkers');

    countries.forEach((country, index) => {
        const marker = document.createElement('div');
        marker.className = 'country-marker locked';
        marker.id = `marker-${country.id}`;
        marker.innerHTML = `
            <div class="marker-dot"></div>
            <div class="marker-label">
                <div class="country-name-label">${country.flag} ${country.name}</div>
                <div class="code-display-text" id="code-${country.id}">LOCKED</div>
                <div class="copy-hint">Copy manually - 2 sec!</div>
            </div>
        `;

        // No auto-copy - user must manually copy

        markersContainer.appendChild(marker);
    });

    updateMarkerPositions();
}

// Convert lat/lon to 3D coordinates
function latLonToXYZ(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return { x, y, z };
}

// Project 3D point to 2D screen
function project3DTo2D(x, y, z) {
    const scale = 400 / (400 + z);
    const x2d = x * scale + earthCanvas.width / 2;
    const y2d = y * scale + earthCanvas.height / 2;

    return { x: x2d, y: y2d, scale, visible: z > -earthRadius };
}

// Update marker positions based on Earth rotation
function updateMarkerPositions() {
    countries.forEach((country) => {
        const marker = document.getElementById(`marker-${country.id}`);
        if (!marker) return;

        const { x, y, z } = latLonToXYZ(country.lat, country.lon + earthRotation, earthRadius);
        const { x: x2d, y: y2d, scale, visible } = project3DTo2D(x, y, z);

        if (visible) {
            marker.style.left = x2d + 'px';
            marker.style.top = y2d + 'px';
            marker.style.display = 'block';
            marker.style.zIndex = Math.floor(z + 1000);
            marker.style.opacity = Math.max(0.3, scale);
        } else {
            marker.style.display = 'none';
        }
    });
}

// Draw the Earth globe
function drawEarth() {
    const centerX = earthCanvas.width / 2;
    const centerY = earthCanvas.height / 2;

    // Clear canvas
    earthCtx.clearRect(0, 0, earthCanvas.width, earthCanvas.height);

    // Draw outer glow
    const glowGradient = earthCtx.createRadialGradient(centerX, centerY, earthRadius - 20, centerX, centerY, earthRadius + 30);
    glowGradient.addColorStop(0, 'rgba(157, 78, 221, 0)');
    glowGradient.addColorStop(0.8, 'rgba(157, 78, 221, 0.3)');
    glowGradient.addColorStop(1, 'rgba(199, 125, 255, 0.6)');
    earthCtx.fillStyle = glowGradient;
    earthCtx.beginPath();
    earthCtx.arc(centerX, centerY, earthRadius + 30, 0, Math.PI * 2);
    earthCtx.fill();

    // Draw Earth sphere with gradient
    const sphereGradient = earthCtx.createRadialGradient(
        centerX - earthRadius / 3,
        centerY - earthRadius / 3,
        earthRadius / 4,
        centerX,
        centerY,
        earthRadius
    );
    sphereGradient.addColorStop(0, 'rgba(90, 24, 154, 0.4)');
    sphereGradient.addColorStop(0.5, 'rgba(26, 26, 46, 0.8)');
    sphereGradient.addColorStop(1, 'rgba(10, 10, 20, 1)');

    earthCtx.fillStyle = sphereGradient;
    earthCtx.beginPath();
    earthCtx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
    earthCtx.fill();

    // Draw latitude lines
    earthCtx.strokeStyle = 'rgba(157, 78, 221, 0.3)';
    earthCtx.lineWidth = 1;

    for (let lat = -60; lat <= 60; lat += 30) {
        earthCtx.beginPath();
        for (let lon = -180; lon <= 180; lon += 5) {
            const { x, y, z } = latLonToXYZ(lat, lon + earthRotation, earthRadius);
            const { x: x2d, y: y2d, visible } = project3DTo2D(x, y, z);

            if (visible) {
                if (lon === -180) {
                    earthCtx.moveTo(x2d, y2d);
                } else {
                    earthCtx.lineTo(x2d, y2d);
                }
            }
        }
        earthCtx.stroke();
    }

    // Draw longitude lines
    for (let lon = 0; lon < 360; lon += 30) {
        earthCtx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
            const { x, y, z } = latLonToXYZ(lat, lon + earthRotation, earthRadius);
            const { x: x2d, y: y2d, visible } = project3DTo2D(x, y, z);

            if (visible) {
                if (lat === -90) {
                    earthCtx.moveTo(x2d, y2d);
                } else {
                    earthCtx.lineTo(x2d, y2d);
                }
            }
        }
        earthCtx.stroke();
    }

    // Draw continent outlines (simplified)
    drawContinents();
}

// Draw detailed continent shapes
function drawContinents() {
    earthCtx.fillStyle = 'rgba(157, 78, 221, 0.3)';
    earthCtx.strokeStyle = 'rgba(199, 125, 255, 0.6)';
    earthCtx.lineWidth = 1.5;

    // More detailed continent outlines
    const continents = {
        // North America - more detailed outline
        northAmerica: [
            { lat: 70, lon: -100 }, { lat: 65, lon: -140 }, { lat: 60, lon: -150 },
            { lat: 50, lon: -130 }, { lat: 45, lon: -125 }, { lat: 40, lon: -120 },
            { lat: 35, lon: -118 }, { lat: 30, lon: -115 }, { lat: 25, lon: -110 },
            { lat: 20, lon: -100 }, { lat: 25, lon: -80 }, { lat: 30, lon: -85 },
            { lat: 35, lon: -95 }, { lat: 40, lon: -100 }, { lat: 45, lon: -95 },
            { lat: 50, lon: -90 }, { lat: 55, lon: -85 }, { lat: 60, lon: -80 },
            { lat: 65, lon: -70 }, { lat: 60, lon: -65 }, { lat: 50, lon: -60 }
        ],
        // South America
        southAmerica: [
            { lat: 10, lon: -75 }, { lat: 5, lon: -80 }, { lat: 0, lon: -78 },
            { lat: -5, lon: -75 }, { lat: -10, lon: -70 }, { lat: -15, lon: -65 },
            { lat: -20, lon: -60 }, { lat: -25, lon: -58 }, { lat: -30, lon: -55 },
            { lat: -35, lon: -60 }, { lat: -40, lon: -65 }, { lat: -45, lon: -70 },
            { lat: -50, lon: -72 }, { lat: -45, lon: -75 }, { lat: -35, lon: -72 },
            { lat: -25, lon: -70 }, { lat: -15, lon: -75 }, { lat: -5, lon: -80 }
        ],
        // Europe
        europe: [
            { lat: 70, lon: 25 }, { lat: 65, lon: 30 }, { lat: 60, lon: 28 },
            { lat: 55, lon: 15 }, { lat: 50, lon: 5 }, { lat: 45, lon: 0 },
            { lat: 40, lon: -5 }, { lat: 38, lon: 0 }, { lat: 40, lon: 10 },
            { lat: 45, lon: 15 }, { lat: 50, lon: 20 }, { lat: 55, lon: 25 }
        ],
        // Africa
        africa: [
            { lat: 35, lon: 10 }, { lat: 30, lon: 5 }, { lat: 20, lon: 0 },
            { lat: 10, lon: 5 }, { lat: 0, lon: 15 }, { lat: -10, lon: 20 },
            { lat: -20, lon: 25 }, { lat: -30, lon: 28 }, { lat: -35, lon: 22 },
            { lat: -30, lon: 18 }, { lat: -20, lon: 15 }, { lat: -10, lon: 12 },
            { lat: 0, lon: 10 }, { lat: 10, lon: 15 }, { lat: 20, lon: 20 },
            { lat: 30, lon: 30 }, { lat: 35, lon: 35 }
        ],
        // Asia
        asia: [
            { lat: 70, lon: 100 }, { lat: 65, lon: 80 }, { lat: 60, lon: 70 },
            { lat: 55, lon: 60 }, { lat: 50, lon: 70 }, { lat: 45, lon: 80 },
            { lat: 40, lon: 90 }, { lat: 35, lon: 100 }, { lat: 30, lon: 110 },
            { lat: 25, lon: 120 }, { lat: 20, lon: 115 }, { lat: 15, lon: 105 },
            { lat: 10, lon: 100 }, { lat: 15, lon: 95 }, { lat: 20, lon: 90 },
            { lat: 25, lon: 85 }, { lat: 30, lon: 80 }, { lat: 35, lon: 75 },
            { lat: 40, lon: 70 }, { lat: 45, lon: 65 }, { lat: 50, lon: 75 },
            { lat: 55, lon: 85 }, { lat: 60, lon: 95 }, { lat: 65, lon: 110 },
            { lat: 70, lon: 130 }, { lat: 65, lon: 140 }, { lat: 55, lon: 145 },
            { lat: 45, lon: 140 }, { lat: 40, lon: 130 }
        ],
        // Australia
        australia: [
            { lat: -10, lon: 130 }, { lat: -15, lon: 135 }, { lat: -20, lon: 140 },
            { lat: -25, lon: 145 }, { lat: -30, lon: 148 }, { lat: -35, lon: 145 },
            { lat: -38, lon: 140 }, { lat: -35, lon: 135 }, { lat: -30, lon: 130 },
            { lat: -25, lon: 125 }, { lat: -20, lon: 120 }, { lat: -15, lon: 125 }
        ]
    };

    // Draw each continent
    Object.values(continents).forEach(continent => {
        earthCtx.beginPath();
        let firstPoint = true;

        continent.forEach(point => {
            const { x, y, z } = latLonToXYZ(point.lat, point.lon + earthRotation, earthRadius);
            const { x: x2d, y: y2d, visible } = project3DTo2D(x, y, z);

            if (visible) {
                if (firstPoint) {
                    earthCtx.moveTo(x2d, y2d);
                    firstPoint = false;
                } else {
                    earthCtx.lineTo(x2d, y2d);
                }
            }
        });

        earthCtx.closePath();
        earthCtx.fill();
        earthCtx.stroke();
    });
}

// Animate Earth rotation
function animateEarth() {
    earthRotation += 0.2; // Slow rotation
    if (earthRotation >= 360) earthRotation = 0;

    drawEarth();
    updateMarkerPositions();

    animationFrame = requestAnimationFrame(animateEarth);
}

async function fetchTokenData() {
    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`);
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
            const pair = data.pairs[0];

            // Update Market Cap and detect +10k changes
            const currentMcap = pair.marketCap || 0;

            // Initialize milestone on first load
            if (previousMcap === 0) {
                previousMcap = currentMcap;
                mcapMilestone = Math.floor(currentMcap / 10000) * 10000;
            }

            // Check if we crossed a 10k milestone
            const newMilestone = Math.floor(currentMcap / 10000) * 10000;
            if (newMilestone > mcapMilestone && previousMcap > 0) {
                const increase = newMilestone - mcapMilestone;
                onMilestoneReached(increase, currentMcap);
                mcapMilestone = newMilestone;
            }

            previousMcap = currentMcap;

            // Update UI
            const mcap = pair.marketCap ? `$${formatNumber(pair.marketCap)}` : 'N/A';
            document.getElementById('mcap').textContent = mcap;
            document.getElementById('mcap').classList.remove('loading');

            const price = pair.priceUsd ? `$${parseFloat(pair.priceUsd).toFixed(8)}` : 'N/A';
            document.getElementById('price').textContent = price;
            document.getElementById('price').classList.remove('loading');

            const volume = pair.volume?.h24 ? `$${formatNumber(pair.volume.h24)}` : 'N/A';
            document.getElementById('volume').textContent = volume;
            document.getElementById('volume').classList.remove('loading');

            const change = pair.priceChange?.h24 ? `${pair.priceChange.h24.toFixed(2)}%` : 'N/A';
            const changeEl = document.getElementById('change');
            changeEl.textContent = change;
            changeEl.classList.remove('loading');
            if (pair.priceChange?.h24 >= 0) {
                changeEl.classList.add('positive');
            } else {
                changeEl.classList.add('negative');
            }

            const buys = pair.txns?.h24?.buys || 0;
            const sells = pair.txns?.h24?.sells || 0;
            document.getElementById('buys').textContent = buys;
            document.getElementById('buys').classList.remove('loading');
            document.getElementById('sells').textContent = sells;
            document.getElementById('sells').classList.remove('loading');
        }
    } catch (error) {
        console.error('Error fetching token data:', error);
    }
}

function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
}

function onMilestoneReached(increase, newMcap) {
    console.log(`🚀 MILESTONE: +$${formatNumber(increase)} → New: $${formatNumber(newMcap)}`);

    // Update mission status
    document.getElementById('missionStatus').textContent = `🎯 MILESTONE REACHED! +$${formatNumber(increase)}`;

    // Unlock next country
    if (currentCountryIndex < countries.length) {
        unlockCountry(countries[currentCountryIndex]);
        currentCountryIndex++;
    }

    // Play sound
    playMilestoneSound();

    // Update next milestone info
    updateNextMilestone();
}

function unlockCountry(country) {
    // Generate unique code for this country
    const code = generateCode();
    const reward = parseFloat((Math.random() * 0.1 + 0.05).toFixed(2)); // 0.05-0.15 SOL

    const codeData = {
        country: country.name,
        flag: country.flag,
        code: code,
        reward: reward,
        claimed: false
    };

    unlockedCodes.push(codeData);

    // Activate marker on globe and show code
    const marker = document.getElementById(`marker-${country.id}`);
    const codeElement = document.getElementById(`code-${country.id}`);

    if (marker) {
        marker.classList.remove('locked');
        marker.classList.add('active');
        const dot = marker.querySelector('.marker-dot');
        if (dot) dot.classList.add('active');
    }

    // Display the code on the marker for 2 seconds
    if (codeElement) {
        codeElement.textContent = code;
        codeElement.style.color = '#e0aaff';

        // Remove code and deactivate marker after 2 seconds
        setTimeout(() => {
            codeElement.textContent = 'EXPIRED';
            codeElement.style.color = '#5a189a';
            codeElement.style.opacity = '0.5';

            // Remove active state from marker
            if (marker) {
                marker.classList.remove('active');
                const dot = marker.querySelector('.marker-dot');
                if (dot) dot.classList.remove('active');
            }
        }, 2000);
    }

    // Add code card to right panel
    addCodeCard(codeData, unlockedCodes.length - 1);

    // Show notification with animation
    showNotification(`🎉 CODE UNLOCKED: ${country.flag} ${country.name} - You have 2 seconds to copy!`);

    // Flash effect on Earth
    flashEarthGlow();
}

function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function addCodeCard(codeData, index) {
    const container = document.getElementById('codesContainer');

    // Clear all previous codes - only show one at a time
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'code-section';
    card.innerHTML = `
        <div class="country-flag">${codeData.flag}</div>
        <div class="country-name">${codeData.country}</div>
        <div class="code-display">
            <div class="code-text">CHECK EARTH</div>
        </div>
        <input type="text" class="code-input" id="codeInput${index}" placeholder="// PASTE CODE HERE">
        <button class="claim-btn" onclick="claimCode(${index})">CLAIM ${codeData.reward} SOL</button>
        <div class="message" id="codeMessage${index}"></div>
        <div class="reward-info">Reward: ${codeData.reward} SOL</div>
    `;

    container.appendChild(card);

    // Completely remove the code card after 2 seconds
    setTimeout(() => {
        container.innerHTML = '';
        // Show placeholder
        container.innerHTML = `
            <div class="code-section">
                <div class="country-flag">⏳</div>
                <div class="country-name">CODE EXPIRED</div>
                <div class="code-display">
                    <div class="code-locked">●●●●●●●●</div>
                </div>
                <div class="reward-info">Wait for next milestone</div>
            </div>
        `;
    }, 2000);
}

function claimCode(index) {
    const codeData = unlockedCodes[index];
    if (codeData.claimed) {
        showCodeMessage(index, 'Already claimed!', 'error');
        return;
    }

    const input = document.getElementById(`codeInput${index}`);
    const enteredCode = input.value.trim().toUpperCase();

    if (!enteredCode) {
        showCodeMessage(index, '⚠️ Enter the code', 'error');
        return;
    }

    if (enteredCode === codeData.code) {
        codeData.claimed = true;
        totalRewardsEarned += codeData.reward;
        totalClaims++;

        showCodeMessage(index, `✅ Success! +${codeData.reward} SOL claimed!`, 'success');

        // Disable input and button
        input.disabled = true;
        const btn = input.nextElementSibling;
        btn.disabled = true;
        btn.textContent = 'CLAIMED ✓';

        // Update total rewards
        updateTotalRewards();

        // Show wallet section if not visible
        document.getElementById('walletSection').classList.add('active');

        // Play success sound
        playSuccessSound();
    } else {
        showCodeMessage(index, '❌ Invalid code', 'error');
    }
}

function showCodeMessage(index, text, type) {
    const messageEl = document.getElementById(`codeMessage${index}`);
    messageEl.className = `message ${type}`;
    messageEl.textContent = text;

    if (type === 'success') {
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

function updateTotalRewards() {
    document.getElementById('totalRewards').textContent = `${totalRewardsEarned.toFixed(2)} SOL`;
}

function updateNextMilestone() {
    const nextMilestone = mcapMilestone + 10000;
    document.getElementById('nextMilestone').textContent = `Next code unlocks at $${formatNumber(nextMilestone)} MCAP`;
}

async function submitWallet() {
    const walletInput = document.getElementById('walletInput');
    const wallet = walletInput.value.trim();
    const messageEl = document.getElementById('walletMessage');

    if (!wallet) {
        messageEl.className = 'message error';
        messageEl.textContent = '⚠️ Please enter your wallet address';
        return;
    }

    if (wallet.length < 32 || wallet.length > 44) {
        messageEl.className = 'message error';
        messageEl.textContent = '❌ Invalid Solana wallet address';
        return;
    }

    if (totalRewardsEarned === 0) {
        messageEl.className = 'message error';
        messageEl.textContent = '❌ Claim codes first to earn rewards';
        return;
    }

    messageEl.className = 'message';
    messageEl.textContent = '⏳ Submitting...';
    messageEl.style.display = 'block';

    try {
        const response = await fetch('http://localhost:3000/submit-wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wallet: wallet,
                sakuraAmount: totalRewardsEarned,
                claimCount: totalClaims,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleString()
            })
        });

        const data = await response.json();

        if (response.ok) {
            messageEl.className = 'message success';
            messageEl.textContent = `✅ Wallet submitted! Total: ${totalRewardsEarned.toFixed(2)} SOL`;
            walletInput.value = '';
            walletInput.disabled = true;

            const submitBtn = walletInput.nextElementSibling;
            submitBtn.disabled = true;
            submitBtn.textContent = 'SUBMITTED ✓';
        } else {
            messageEl.className = 'message error';
            messageEl.textContent = '❌ ' + (data.error || 'Submission failed');
        }
    } catch (error) {
        messageEl.className = 'message error';
        messageEl.textContent = '❌ Server error. Make sure server is running.';
        console.error('Error:', error);
    }
}

function showCountryInfo(country) {
    const codeData = unlockedCodes.find(c => c.country === country.name);
    if (codeData) {
        showNotification(`${country.flag} ${country.name}: Code ${codeData.code} ${codeData.claimed ? '(Claimed)' : '(Available)'}`);
    } else {
        showNotification(`${country.flag} ${country.name}: Locked - Waiting for milestone`);
    }
}

function showNotification(message) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid #9d4edd;
        box-shadow: 0 0 30px rgba(157, 78, 221, 0.7);
        padding: 20px;
        border-radius: 10px;
        color: #c77dff;
        font-size: 16px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function playMilestoneSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.2);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator.start(now);
        oscillator.stop(now + 0.3);
    } catch (e) {
        console.error('Audio error:', e);
    }
}

function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.exponentialRampToValueAtTime(900, now + 0.15);

        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.2);
    } catch (e) {
        console.error('Audio error:', e);
    }
}

function goToToken() {
    window.open(`https://pump.fun/coin/${TOKEN_ADDRESS}`, '_blank');
}

function copyCA() {
    navigator.clipboard.writeText(TOKEN_ADDRESS).then(() => {
        showNotification('✅ Contract Address copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = TOKEN_ADDRESS;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('✅ Contract Address copied to clipboard!');
    });
}

function flashEarthGlow() {
    const worldMap = document.getElementById('worldMap');
    worldMap.style.boxShadow = 'inset 0 0 100px rgba(199, 125, 255, 0.8), 0 0 50px rgba(199, 125, 255, 0.6)';
    setTimeout(() => {
        worldMap.style.boxShadow = 'inset 0 0 50px rgba(157, 78, 221, 0.2)';
    }, 500);
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    init();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
