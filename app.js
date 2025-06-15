class MoodGarden {
    constructor() {
        this.flowers = JSON.parse(localStorage.getItem('moodFlowers')) || [];
        this.affirmations = {
            happy: [
                "Your joy is contagious and brightens everyone's day! 🌞",
                "Happiness looks beautiful on you! Keep shining! ✨",
                "Your positive energy is a gift to the world! 🎁",
                "Today is full of possibilities because you choose joy! 🌈"
            ],
            calm: [
                "In stillness, you find your greatest strength. 🧘‍♀️",
                "Your peaceful energy creates ripples of tranquility. 🌊",
                "Breathe deeply - you are exactly where you need to be. 🍃",
                "Your calm presence is a sanctuary for others. 🕊️"
            ],
            energetic: [
                "Your enthusiasm is unstoppable! Go conquer the day! ⚡",
                "Your energy could power a city! Use it wisely! 🚀",
                "You're a force of nature - bold, bright, and beautiful! 🌟",
                "Channel that amazing energy into something incredible! 💫"
            ],
            peaceful: [
                "You are grounded, centered, and beautifully balanced. 🌿",
                "Your inner peace is your superpower. 🌸",
                "In harmony with yourself, you're unstoppable. 🦋",
                "Your serenity creates space for miracles. 🌺"
            ]
        };
        
        this.moodEmojis = {
            happy: '🌻',
            calm: '🌼',
            energetic: '🌺',
            peaceful: '🌸'
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderGarden();
        this.updateStats();
        this.registerServiceWorker();
    }
    
    setupEventListeners() {
        const moodButtons = document.querySelectorAll('.mood-btn');
        moodButtons.forEach(button => {
            button.addEventListener('click', (e) => this.selectMood(e));
        });
    }
    
    selectMood(e) {
        const mood = e.target.dataset.mood;
        const color = e.target.dataset.color;
        
        // Update UI
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        document.body.className = color;
        
        // Show affirmation
        this.showAffirmation(mood);
        
        // Plant flower
        this.plantFlower(mood);
    }
    
    showAffirmation(mood) {
        const affirmationSection = document.getElementById('affirmationSection');
        const affirmationText = document.getElementById('affirmationText');
        
        const randomAffirmation = this.affirmations[mood][Math.floor(Math.random() * this.affirmations[mood].length)];
        
        affirmationText.textContent = randomAffirmation;
        affirmationSection.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            affirmationSection.style.display = 'none';
        }, 5000);
    }
    
    plantFlower(mood) {
        const flower = {
            id: Date.now(),
            mood: mood,
            emoji: this.moodEmojis[mood],
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
        };
        
        this.flowers.push(flower);
        this.saveFlowers();
        this.renderGarden();
        this.updateStats();
    }
    
    renderGarden() {
        const gardenGrid = document.getElementById('gardenGrid');
        
        if (this.flowers.length === 0) {
            gardenGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: #9CA3AF; font-style: italic; padding: 2rem;">
                    Your garden is waiting for its first flower! 🌱<br>
                    Select a mood above to plant your first bloom.
                </div>
            `;
            return;
        }
        
        gardenGrid.innerHTML = this.flowers.map(flower => `
            <div class="flower ${flower.mood}" title="Planted on ${flower.date}" data-id="${flower.id}">
                ${flower.emoji}
            </div>
        `).join('');
        
        // Add click listeners to flowers
        document.querySelectorAll('.flower').forEach(flower => {
            flower.addEventListener('click', (e) => {
                const flowerId = e.target.dataset.id;
                this.removeFlower(flowerId);
            });
        });
    }
    
    removeFlower(flowerId) {
        this.flowers = this.flowers.filter(flower => flower.id != flowerId);
        this.saveFlowers();
        this.renderGarden();
        this.updateStats();
    }
    
    updateStats() {
        const flowerCount = document.getElementById('flowerCount');
        const daysActive = document.getElementById('daysActive');
        
        flowerCount.textContent = this.flowers.length;
        
        const uniqueDates = [...new Set(this.flowers.map(flower => flower.date))];
        daysActive.textContent = uniqueDates.length;
    }
    
    saveFlowers() {
        localStorage.setItem('moodFlowers', JSON.stringify(this.flowers));
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MoodGarden();
});

// PWA Install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button or prompt
    console.log('PWA install prompt available');
});

window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
});
