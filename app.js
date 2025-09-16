// Love Calculator JavaScript
class LoveCalculator {
    constructor() {
        this.form = document.getElementById('loveForm');
        this.name1Input = document.getElementById('name1');
        this.name2Input = document.getElementById('name2');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingAnimation = document.getElementById('loadingAnimation');
        this.resultContainer = document.getElementById('resultContainer');
        this.resultNames = document.getElementById('resultNames');
        this.percentageNumber = document.getElementById('percentageNumber');
        this.percentageCircle = document.getElementById('percentageCircle');
        this.resultMessage = document.getElementById('resultMessage');
        this.resultHearts = document.getElementById('resultHearts');

        this.compatibilityRanges = [
            {"min": 90, "max": 100, "message": "Perfect Match! ❤️ You two are meant to be together!", "color": "#ff1744"},
            {"min": 80, "max": 89, "message": "Excellent Compatibility! 💕 You make a great couple!", "color": "#e91e63"},
            {"min": 70, "max": 79, "message": "Very Good Match! 😍 You have strong chemistry!", "color": "#f06292"},
            {"min": 60, "max": 69, "message": "Good Compatibility! 💖 You complement each other well!", "color": "#ba68c8"},
            {"min": 50, "max": 59, "message": "Average Match! 💘 With effort, you can make it work!", "color": "#9575cd"},
            {"min": 40, "max": 49, "message": "Below Average! 💔 You might face some challenges!", "color": "#7986cb"},
            {"min": 30, "max": 39, "message": "Low Compatibility! 😔 You may need to work harder!", "color": "#64b5f6"},
            {"min": 0, "max": 29, "message": "Very Low Match! 💯 Opposites attract, or maybe not!", "color": "#4fc3f7"}
        ];

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.resetBtn.addEventListener('click', () => this.resetCalculator());
        
        // Add input event listeners for real-time validation
        this.name1Input.addEventListener('input', () => this.clearError());
        this.name2Input.addEventListener('input', () => this.clearError());
        
        // Add enter key support
        this.name1Input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.name2Input.focus();
            }
        });
        
        this.name2Input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleFormSubmit(e);
            }
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const name1 = this.name1Input.value.trim();
        const name2 = this.name2Input.value.trim();

        if (!this.validateInputs(name1, name2)) {
            return;
        }

        this.calculateLove(name1, name2);
    }

    validateInputs(name1, name2) {
        if (!name1 || !name2) {
            this.showError('Please enter both names to calculate love compatibility! 💕');
            return false;
        }

        if (name1.length < 2 || name2.length < 2) {
            this.showError('Names must be at least 2 characters long! 😊');
            return false;
        }

        if (name1.toLowerCase() === name2.toLowerCase()) {
            this.showError('Please enter two different names! 😄');
            return false;
        }

        return true;
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        
        // Hide error after 4 seconds
        setTimeout(() => {
            this.clearError();
        }, 4000);
    }

    clearError() {
        this.errorMessage.classList.remove('show');
    }

    calculateLove(name1, name2) {
        // Hide previous results and errors
        this.hideResults();
        this.clearError();
        
        // Show loading animation
        this.showLoading();

        // Calculate after a brief delay for better UX
        setTimeout(() => {
            const percentage = this.calculateCompatibility(name1, name2);
            const compatibilityData = this.getCompatibilityMessage(percentage);
            
            this.hideLoading();
            this.showResults(name1, name2, percentage, compatibilityData);
        }, 1500);
    }

    calculateCompatibility(name1, name2) {
        // Normalize names (lowercase, remove spaces and special characters)
        const normalizedName1 = name1.toLowerCase().replace(/[^a-z]/g, '');
        const normalizedName2 = name2.toLowerCase().replace(/[^a-z]/g, '');
        
        // Sort names to ensure same result regardless of order
        const sortedNames = [normalizedName1, normalizedName2].sort();
        const combinedNames = sortedNames.join('');
        
        // Calculate ASCII sum
        let asciiSum = 0;
        for (let i = 0; i < combinedNames.length; i++) {
            asciiSum += combinedNames.charCodeAt(i);
        }
        
        // Apply mathematical transformations to get a percentage
        // Use multiple operations to create more varied results
        let result = asciiSum;
        result = result * 7; // Multiply by prime number
        result = result ^ (combinedNames.length * 3); // XOR with length factor
        result = Math.abs(result % 10000); // Get absolute value and limit range
        
        // Additional transformation based on name characteristics
        const vowels = 'aeiou';
        let vowelCount = 0;
        let consonantCount = 0;
        
        for (let char of combinedNames) {
            if (vowels.includes(char)) {
                vowelCount++;
            } else {
                consonantCount++;
            }
        }
        
        // Factor in vowel/consonant ratio
        const ratio = vowelCount + consonantCount > 0 ? (vowelCount / (vowelCount + consonantCount)) : 0.5;
        result = result + (ratio * 1000);
        
        // Final calculation to get 0-100 range
        const percentage = Math.floor(result % 101);
        
        // Ensure we don't get 0% (make minimum 1%)
        return percentage === 0 ? 1 : percentage;
    }

    getCompatibilityMessage(percentage) {
        for (let range of this.compatibilityRanges) {
            if (percentage >= range.min && percentage <= range.max) {
                return range;
            }
        }
        // Fallback (shouldn't happen)
        return this.compatibilityRanges[this.compatibilityRanges.length - 1];
    }

    showLoading() {
        this.loadingAnimation.classList.remove('hidden');
        this.loadingAnimation.classList.add('show');
        this.calculateBtn.disabled = true;
        this.calculateBtn.style.opacity = '0.6';
    }

    hideLoading() {
        this.loadingAnimation.classList.remove('show');
        this.loadingAnimation.classList.add('hidden');
        this.calculateBtn.disabled = false;
        this.calculateBtn.style.opacity = '1';
    }

    hideResults() {
        this.resultContainer.classList.remove('show');
        this.resultContainer.classList.add('hidden');
    }

    showResults(name1, name2, percentage, compatibilityData) {
        // Set result names with romantic formatting
        this.resultNames.textContent = `${name1} 💕 ${name2}`;
        
        // Animate percentage counting up
        this.animatePercentage(percentage);
        
        // Set result message and color
        this.resultMessage.textContent = compatibilityData.message;
        this.resultMessage.style.color = compatibilityData.color;
        this.percentageCircle.style.background = `linear-gradient(135deg, ${compatibilityData.color}, ${this.darkenColor(compatibilityData.color, 20)})`;
        
        // Generate hearts based on percentage
        this.generateResultHearts(percentage);
        
        // Show results with animation
        this.resultContainer.classList.remove('hidden');
        
        // Add slight delay for better animation effect
        setTimeout(() => {
            this.resultContainer.classList.add('show');
        }, 100);
    }

    animatePercentage(targetPercentage) {
        let currentPercentage = 0;
        const increment = Math.max(1, Math.floor(targetPercentage / 30));
        const duration = 1000; // 1 second
        const stepTime = duration / (targetPercentage / increment);
        
        const timer = setInterval(() => {
            currentPercentage += increment;
            if (currentPercentage >= targetPercentage) {
                currentPercentage = targetPercentage;
                clearInterval(timer);
            }
            this.percentageNumber.textContent = currentPercentage;
        }, stepTime);
    }

    generateResultHearts(percentage) {
        const heartTypes = ['❤️', '💕', '💖', '💘', '💝', '💗'];
        let numHearts = Math.floor(percentage / 20) + 1; // 1-6 hearts based on percentage
        numHearts = Math.max(1, Math.min(6, numHearts));
        
        this.resultHearts.innerHTML = '';
        
        for (let i = 0; i < numHearts; i++) {
            const heart = document.createElement('span');
            heart.textContent = heartTypes[i % heartTypes.length];
            heart.className = 'heart';
            heart.style.animationDelay = `${i * 0.1}s`;
            this.resultHearts.appendChild(heart);
        }
    }

    darkenColor(hex, percent) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Convert to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Darken
        const factor = (100 - percent) / 100;
        const newR = Math.floor(r * factor);
        const newG = Math.floor(g * factor);
        const newB = Math.floor(b * factor);
        
        // Convert back to hex
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    resetCalculator() {
        // Clear inputs
        this.name1Input.value = '';
        this.name2Input.value = '';
        
        // Hide all result elements
        this.hideResults();
        this.hideLoading();
        this.clearError();
        
        // Focus first input
        this.name1Input.focus();
        
        // Reset button states
        this.calculateBtn.disabled = false;
        this.calculateBtn.style.opacity = '1';
        
        // Add a subtle animation to indicate reset
        this.form.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.form.style.transform = 'scale(1)';
        }, 150);
    }
}

// Initialize the Love Calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoveCalculator();
});

// Add some fun interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add click effect to floating hearts
    const floatingHearts = document.querySelectorAll('.floating-hearts .heart');
    floatingHearts.forEach(heart => {
        heart.addEventListener('click', () => {
            heart.style.animation = 'none';
            heart.offsetHeight; // Trigger reflow
            heart.style.animation = 'floatUp 2s ease-out';
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Reset with Escape key
        if (e.key === 'Escape') {
            const calculator = new LoveCalculator();
            calculator.resetCalculator();
        }
    });
    
    // Add some sparkle effect on successful calculation
    const addSparkleEffect = () => {
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.position = 'fixed';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = '20px';
        sparkle.style.zIndex = '1000';
        sparkle.style.animation = 'sparkle 2s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    };
    
    // CSS for sparkle animation
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkle {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1) rotate(180deg); opacity: 1; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(sparkleStyle);
    
    // Add sparkles when results are shown
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                mutation.target.classList.contains('result-container') && 
                mutation.target.classList.contains('show')) {
                // Add sparkles with delay
                setTimeout(addSparkleEffect, 500);
                setTimeout(addSparkleEffect, 800);
                setTimeout(addSparkleEffect, 1200);
            }
        });
    });
    
    const resultContainer = document.getElementById('resultContainer');
    if (resultContainer) {
        observer.observe(resultContainer, { attributes: true, attributeFilter: ['class'] });
    }
});