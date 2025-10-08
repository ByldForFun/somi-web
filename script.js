// Smooth animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class for smooth page transition
    document.body.classList.add('loaded');
    
    // Form interactions
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const formMessage = document.getElementById('formMessage');
    const secondaryButton = document.querySelector('.cta-secondary');
    
    // Email form submission
    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        showFormMessage('Adding you to our list...', 'success');
        emailInput.disabled = true;
        
        try {
            // Use form submission to avoid CORS issues
            const formData = new FormData();
            formData.append('email', email);
            
            const response = await fetch('https://script.google.com/macros/s/AKfycbzlk9SfRy29sEGTkdXo-k7yw89OUQUOg5hh7iUo-Yse5rluznw93CWooYcDoY3CgavZ/exec', {
                method: 'POST',
                body: formData
            });
            
            // For Google Apps Script, we often get HTML response, so we'll assume success
            if (response.ok) {
                showFormMessage('Thanks! You\'re on our early access list! 🎉', 'success');
                emailInput.value = '';
            } else {
                showFormMessage('Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Detailed error:', {
                message: error.message,
                stack: error.stack,
                response: error.response
            });
            showFormMessage(`Connection error: ${error.message}`, 'error');
        } finally {
            emailInput.disabled = false;
        }
    });
    
    
    // Social media link handlers
    const socialLinks = document.querySelectorAll('.social-icon');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            createRippleEffect(this);
            
            // Get the platform name from aria-label
            const platform = this.getAttribute('aria-label');
            showNotification(`Opening ${platform}...`, 'info');
        });
    });
    
    // Parallax effect for background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.container');
        const speed = scrolled * 0.5;
        
        parallax.style.transform = `translateY(${speed}px)`;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.header, .main-content, .footer');
    animateElements.forEach(el => observer.observe(el));
});

// Ripple effect function
function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form message display
function showFormMessage(message, type = 'info') {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 5000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('cta-primary') || 
            focusedElement.classList.contains('cta-secondary') ||
            focusedElement.classList.contains('social-icon')) {
            e.preventDefault();
            focusedElement.click();
        }
    }
});

// Performance optimization: Lazy load images if any are added later
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if images exist
lazyLoadImages();
