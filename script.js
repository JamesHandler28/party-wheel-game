// --- Game Data (with Emojis) ---
// This is your new, expanded list of party games!
const games = [
    { name: "Categories", emoji: "⏱️", description: "The spinner says a category (e.g., 'types of fruit'). Going around the circle, each person must say something in that category. The first person to hesitate or repeat loses." },
    { name: "Zen", emoji: "🕺", description: "The spinner strikes a pose. The last person in the group to perfectly mimic the pose loses." },
    { name: "Snake Eyes", emoji: "🐍", description: "The spinner is the 'Snake'. They must try to make eye contact with other players. If you make eye contact with the Snake, you're out! The last player remaining wins." },
    { name: "Thumb Master", emoji: "👍", description: "The spinner is the Thumb Master. At any point, they can secretly place their thumb on the table. The last person to notice and put their own thumb on the table loses." },
    { name: "Swing", emoji: "💃", description: "The spinner starts a dance move. The next person mimics it and adds their own move. This continues around the circle, creating a sequence. The first person to forget the sequence loses." },
    { name: "Rhyme", emoji: "🗣️", description: "The spinner says a word. Going around the circle, each person must say a word that rhymes with it. The first person to hesitate or repeat a word loses." },
    { name: "I Never", emoji: "🚫", description: "The spinner says something they've 'never' done. Anyone in the group who *has* done it, loses this round." },
    { name: "Phrases", emoji: "🤐", description: "The spinner picks a common phrase (e.g., 'you know'). For the rest of the game, anyone who says this phrase loses." },
    { name: "Questions", emoji: "❓", description: "The spinner asks someone a question. That person must answer by asking someone else a question. The first person to hesitate or make a statement loses." },
    { name: "Dare", emoji: "😱", description: "The spinner must perform a dare that the rest of the group comes up with." },
    { name: "True or False", emoji: "🎭", description: "The spinner makes a statement about themselves. Everyone else guesses if it's true or false. Those who guess wrong lose." },
    { name: "Rule", emoji: "📜", description: "The spinner creates a new rule (e.g., 'you can't use your left hand'). Anyone who breaks the rule for the rest of the game loses." }
];

// --- DOM Elements ---
const wheel = document.querySelector('.wheel');
const promptText = document.querySelector('.prompt-text');
const overlay = document.getElementById('overlay');
const gameNameEl = document.getElementById('game-name');
const gameDescEl = document.getElementById('game-description');

// --- Game State & Wheel Logic ---
let currentRotation = 0;
let gameState = 'ready';

function setupWheel() {
    wheel.innerHTML = '';

    const segmentAngle = 360 / games.length;
    const colors = ['#e74c3c', '#d35400', '#f39c12', '#f1c40f', '#b1d029ff', '#2ecc71', '#1abc9c', '#3498db', '#2980b9', '#9b59b6', '#be2edd', '#fd79a8'];
    let gradientParts = [];

    const wheelDiameter = wheel.offsetWidth;
    const radius = wheelDiameter * 0.30;

    games.forEach((game, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;
        gradientParts.push(`${colors[index % colors.length]} ${startAngle}deg ${endAngle}deg`);

        const labelAngle = startAngle + (segmentAngle / 2);
        const labelAngleRad = (labelAngle - 90) * Math.PI / 180;

        const x = radius * Math.cos(labelAngleRad);
        const y = radius * Math.sin(labelAngleRad);

        const label = document.createElement('div');
        label.className = 'wheel-label';
        label.textContent = game.emoji;
        
        label.style.left = `calc(50% + ${x}px)`;
        label.style.top = `calc(50% + ${y}px)`;

        label.style.transform = `translate(-50%, -50%) rotate(${labelAngle}deg)`;
        
        wheel.appendChild(label);
    });

    wheel.style.background = `conic-gradient(${gradientParts.join(', ')})`;
}

// --- A single function to handle interactions ---
function handleInteraction() {
    if (gameState === 'ready') {
        gameState = 'spinning';
        promptText.textContent = '...';
        
        const randomExtraRotation = Math.floor(Math.random() * 360);
        const totalRotation = 1800 + randomExtraRotation;
        currentRotation += totalRotation;

        wheel.style.transform = `rotate(${currentRotation}deg)`;

    } else if (gameState === 'showingResult') {
        overlay.classList.remove('show');
        gameState = 'ready';
        promptText.textContent = 'Click or Press OK to spin again!';
    }
}

// --- Event Listeners ---
// Listen for mouse clicks
document.body.addEventListener('click', handleInteraction);

// Listen for keyboard presses
document.body.addEventListener('keydown', (event) => {
    // Check if the pressed key was 'Enter' (the remote's OK button)
    if (event.key === 'Enter') {
        handleInteraction();
    }
});

// Listen for the spin animation to end
wheel.addEventListener('transitionend', () => {
    const segmentAngle = 360 / games.length;
    const finalRawAngle = currentRotation % 360;

    const winningAngle = (360 - finalRawAngle) % 360;
    const winningIndex = Math.floor(winningAngle / segmentAngle);

    const winner = games[winningIndex];

    gameNameEl.textContent = winner.name;
    gameDescEl.textContent = winner.description;

    overlay.classList.add('show');
    gameState = 'showingResult';
});

// Initialize the wheel
setupWheel();

window.addEventListener('resize', setupWheel);