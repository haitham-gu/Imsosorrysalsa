// ===================================
// CONFIGURATION
// ===================================

const TOTAL_SCREENS = 11;
const CONFESSION_DELAY = 3000; // 3 seconds delay for confession screen
const CORRECT_WORD = "bug"; // The word to reveal in screen 2
const RECEIVER_EMAIL = ""; // Optional, not used now (kept for future)

// ===================================
// STATE MANAGEMENT
// ===================================

let currentScreen = 1;
let musicPlaying = false;
let memorySongPlaying = false;

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeConfessionScreen();
    updateProgressBar();
});

// ===================================
// NAVIGATION
// ===================================

/**
 * Navigate to a specific screen
 * @param {number} screenNumber - The screen number to navigate to
 */
function goToScreen(screenNumber) {
    // Hide current screen
    const currentScreenElement = document.getElementById(`screen${currentScreen}`);
    if (currentScreenElement) {
        currentScreenElement.classList.remove('active');
    }
    
    // Show new screen
    currentScreen = screenNumber;
    const newScreenElement = document.getElementById(`screen${currentScreen}`);
    if (newScreenElement) {
        newScreenElement.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Update progress bar
    updateProgressBar();
    
    // Special initialization for certain screens
    if (currentScreen === 4) {
        initializeConfessionScreen();
    }
}

/**
 * Update the progress bar based on current screen
 */
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = (currentScreen / TOTAL_SCREENS) * 100;
    progressBar.style.width = `${progress}%`;
}

/**
 * Leave the website (user chooses not to continue)
 */
function leaveWebsite() {
    if (confirm('Are you sure you want to leave?')) {
        window.close();
        // If window.close() doesn't work (some browsers prevent it),
        // redirect to a blank page or a respectful goodbye message
        setTimeout(() => {
            document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #e8eaed; text-align: center;"><p>You can close this tab now.</p></div>';
        }, 100);
    }
}

/**
 * Close the website (ending screen)
 */
function closeWebsite() {
    window.close();
    // Fallback if window.close() doesn't work
    setTimeout(() => {
        document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #e8eaed; text-align: center;"><p>Thank you. You can close this tab now.</p></div>';
    }, 100);
}

// ===================================
// SCREEN 2: CONFESSION
// ===================================

/**
 * Initialize the confession screen with delayed button activation
 */
function initializeConfessionScreen() {
    const confessionBtn = document.getElementById('confessionBtn');
    const confessionHint = document.getElementById('confessionHint');
    
    if (confessionBtn && currentScreen === 4) {
        // Disable button initially
        confessionBtn.classList.add('disabled');
        
        // Enable after delay
        setTimeout(() => {
            confessionBtn.classList.remove('disabled');
            if (confessionHint) {
                confessionHint.textContent = 'You can continue now.';
                confessionHint.style.opacity = '0.7';
            }
        }, CONFESSION_DELAY);
    }
}

// ===================================
// SCREEN 3: FIRST MESSAGE MEMORY
// ===================================

/**
 * Reveal the blurred word (with or without correct input)
 */
function revealWord() {
    const wordInput = document.getElementById('wordInput');
    const blurredWord = document.getElementById('blurredWord');
    const revealedMessage = document.getElementById('revealedMessage');
    
    // Get user input (if any)
    const userWord = wordInput ? wordInput.value.trim().toLowerCase() : '';
    
    // Reveal the word regardless of input
    if (blurredWord) {
        blurredWord.textContent = CORRECT_WORD;
        blurredWord.classList.add('revealed');
    }
    
    // Show the subtle message
    if (revealedMessage) {
        revealedMessage.classList.remove('hidden');
    }
    
    // No success/failure feedback - just reveal
    // This respects the requirement: "Never block progress, no success/failure feedback"
}

// ===================================
// SCREEN 4: THE WORDS
// ===================================

/**
 * Reveal a word card when clicked
 * @param {HTMLElement} card - The word card element
 * @param {string} word - The word being revealed
 */
function revealWordCard(card, word) {
    const front = card.querySelector('.word-front');
    const back = card.querySelector('.word-back');
    
    if (front && back) {
        // Remove blur from the word
        front.classList.remove('blurred');
        front.classList.add('revealed');
        
        // Show the accountability message
        setTimeout(() => {
            front.classList.add('hidden');
            back.classList.remove('hidden');
        }, 300);
        
        // Disable further clicks on this card
        card.style.cursor = 'default';
        card.onclick = null;
    }
}

// ===================================
// SCREEN 3: MEMORY CARDS
// ===================================

/**
 * Toggle memory card open/close
 * @param {HTMLElement} card - The memory card element
 */
function toggleMemoryCard(card) {
    card.classList.toggle('open');
}

/**
 * Keyboard support for memory cards
 * @param {KeyboardEvent} event - Key press event
 * @param {HTMLElement} card - The memory card element
 */
function toggleMemoryCardKey(event, card) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMemoryCard(card);
    }
}

// ===================================
// SCREEN 6: REFLECTION QUIZ
// ===================================

/**
 * Handle answer selection in the reflection quiz
 * @param {HTMLElement} button - The clicked option button
 * @param {string} type - 'correct' or 'wrong'
 */
function selectAnswer(button, type) {
    const quizFeedback = document.getElementById('quizFeedback');
    const quizContinue = document.getElementById('quizContinue');
    const allOptions = document.querySelectorAll('.quiz-option');
    
    // Disable all options after selection
    allOptions.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Mark the selected button
    button.classList.add('selected');
    button.classList.add(type);
    
    // Show feedback
    if (quizFeedback) {
        quizFeedback.classList.remove('hidden');
        
        if (type === 'correct') {
            quizFeedback.innerHTML = `
                <p><strong>Yes.</strong></p>
                <p>Any of these would have been better than silence followed by attack.</p>
                <p>Clear communication respects the other person's dignity.</p>
                <p>I didn't give you that.</p>
            `;
        } else {
            quizFeedback.innerHTML = `
                <p><strong>No.</strong></p>
                <p>Attacking someone's character is never a solution.</p>
                <p>It's retaliation disguised as communication.</p>
                <p>It causes lasting harm without solving anything.</p>
            `;
        }
    }
    
    // Show continue button
    if (quizContinue) {
        setTimeout(() => {
            quizContinue.classList.remove('hidden');
        }, 500);
    }
}

// ===================================
// SCREEN 9: ENDING
// ===================================
// Final screen now offers Telegram link only (no input handling needed).

// ===================================
// MUSIC TOGGLE
// ===================================

/**
 * Toggle background music on/off
 */
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');

if (musicToggle && backgroundMusic) {
    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            backgroundMusic.pause();
            musicToggle.classList.remove('playing');
            musicPlaying = false;
        } else {
            backgroundMusic.play().catch(error => {
                console.log('Audio playback failed:', error);
                // Handle browsers that block autoplay
            });
            musicToggle.classList.add('playing');
            musicPlaying = true;
        }
    });
}

// ===================================
// MEMORY SONG (SCREEN 10)
// ===================================

const memorySong = document.getElementById('memorySong');
const musicPlayBtn = document.getElementById('musicPlayBtn');

function toggleMemorySong() {
    if (!memorySong) return;
    // If no source is set, give gentle notice
    if (!memorySong.getAttribute('src') && memorySong.querySelector('source') === null) {
        if (musicPlayBtn) {
            musicPlayBtn.textContent = 'Add a song file in the folder first';
        }
        return;
    }

    if (memorySongPlaying) {
        memorySong.pause();
        memorySongPlaying = false;
        if (musicPlayBtn) musicPlayBtn.textContent = 'Play the song';
    } else {
        memorySong.play().then(() => {
            memorySongPlaying = true;
            if (musicPlayBtn) musicPlayBtn.textContent = 'Pause the song';
        }).catch(() => {
            if (musicPlayBtn) musicPlayBtn.textContent = 'Unable to play (check file)';
        });
    }
}

if (memorySong) {
    memorySong.addEventListener('ended', () => {
        memorySongPlaying = false;
        if (musicPlayBtn) musicPlayBtn.textContent = 'Play the song';
    });
}

// ===================================
// ACCESSIBILITY
// ===================================

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', (event) => {
    // Escape key to go back (optional feature)
    if (event.key === 'Escape' && currentScreen > 1) {
        // Optionally implement back navigation
        // For this apology site, we keep it linear (no back button)
    }
});

/**
 * Ensure focus management for accessibility
 */
function manageFocus() {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen) {
        const firstFocusable = activeScreen.querySelector('button, input, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Smooth scroll to top
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===================================
// NOTES FOR CUSTOMIZATION
// ===================================

/*
 * TO EDIT TEXT CONTENT:
 * - Go to index.html
 * - Find the screen you want to edit (screen1, screen2, etc.)
 * - Modify the <p>, <h1>, or list content
 * 
 * TO ADD BACKGROUND MUSIC:
 * - Uncomment the <source> tag in index.html
 * - Add your audio file path
 * - The toggle will work automatically
 * 
 * TO CHANGE COLORS:
 * - Go to style.css
 * - Edit the :root CSS variables at the top
 * 
 * TO CHANGE THE CONFESSION DELAY:
 * - Change CONFESSION_DELAY constant at the top of this file
 * 
 * TO CHANGE THE REVEALED WORD:
 * - Change CORRECT_WORD constant at the top of this file
 */
