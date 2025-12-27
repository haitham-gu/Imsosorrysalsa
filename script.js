const scriptLines = [
    { tag: 'h4', text: 'Look who decided to come back', className: 'message-title' },
    { tag: 'p', text: 'If you see this now' },
    { tag: 'p', text: "It unfortunately means we're not together anymore" },
    { tag: 'p', text: 'And I wanna thank you for all the memories we shared together' },
    { tag: 'p', text: 'From 2023 to 2025 ,' },
    { tag: 'p', text: 'Thank you for making my life brighter even when you saw the dark in me' },
    { tag: 'p', text: 'Thank you for every smile , every tear , every laugh we shared in our journey ,' },
    { tag: 'p', text: 'Thank you for every day we made it together, for every hour we spent.' },
    { tag: 'p', text: 'Wish you a very blessed successful life.' },
    { tag: 'p', text: '', className: 'spacer' },
    { tag: 'p', text: 'My best regards ,' },
    { tag: 'p', text: 'Bany', className: 'signature' }
];

const messageArea = document.getElementById('messageArea');

let currentLine = 0;
let currentChar = 0;
let activeElement = null;

function createLineElement(line) {
    const element = document.createElement(line.tag);
    element.className = line.className || '';
    messageArea.appendChild(element);
    return element;
}

function typeNextCharacter() {
    if (currentLine >= scriptLines.length) {
        return;
    }

    const line = scriptLines[currentLine];
    if (!activeElement) {
        activeElement = createLineElement(line);
    }

    if (!line.text) {
        finishLine();
        return;
    }

    if (currentChar < line.text.length) {
        activeElement.textContent += line.text[currentChar];
        currentChar += 1;
        const delay = 20 + Math.random() * 25;
        setTimeout(typeNextCharacter, delay);
    } else {
        finishLine();
    }
}

function finishLine() {
    currentLine += 1;
    currentChar = 0;
    activeElement = null;
    const pause = currentLine === scriptLines.length ? 0 : 150;
    setTimeout(typeNextCharacter, pause);
}

document.addEventListener('DOMContentLoaded', () => {
    typeNextCharacter();
    setTimeout(initBackgroundAudio, 1000);
});

function initBackgroundAudio() {
    const bgAudio = document.getElementById('backgroundAudio');
    if (!bgAudio) return;
    bgAudio.volume = 0.15;
    bgAudio.muted = true;

    const tryPlay = () => {
        bgAudio.play().catch(() => {
            const listener = () => {
                bgAudio.play().catch(() => {});
                document.removeEventListener('pointerdown', listener);
            };
            document.addEventListener('pointerdown', listener, { once: true });
        });
    };

    tryPlay();
    bgAudio.addEventListener('playing', () => {
        bgAudio.muted = false;
    }, { once: true });
}