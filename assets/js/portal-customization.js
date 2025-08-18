// Save this as /assets/js/portal-customization.js

(function() {
    'use strict';
    
    let isNavigating = false;

function customizePortal() {
    // Prevent multiple rapid executions
    if (isNavigating) return;
    
    const portalFrame = document.querySelector('iframe[data-frame="portal-popup"], iframe[title*="portal"]');
    
    if (!portalFrame?.contentDocument) {
        setTimeout(customizePortal, 500);
        return;
    }
    
    const doc = portalFrame.contentDocument;
    
    // Always remove existing styles first to ensure fresh application
    const existingStyles = doc.getElementById('custom-portal-styles');
    if (existingStyles) {
        existingStyles.remove();
    }
    
    // 1. Add font and remove border radius with higher specificity
    const style = doc.createElement('style');
    style.id = 'custom-portal-styles';
    style.textContent = `
        @font-face {
            font-family: 'Iosevka Custom';
            src: url('/assets/fonts/IosevkaCustom-Regular.woff2') format('woff2');
        }
        * { 
            font-family: 'Iosevka Custom', monospace !important;
        }
        
        
        /* Make description look like link */
        .gh-portal-product-description {
            text-decoration: underline !important;
            text-decoration-color: #e15600 !important;
            text-underline-offset: 2px !important;
            transition: all 0.2s ease !important;
            cursor: pointer !important;
        }
        
        .gh-portal-product-description:hover {
            opacity: 1 !important;
            color: var(--color-primary-text) !important;
            background-color: #e15600 !important;
            text-decoration: none !important;
        }
    `;
    doc.head.appendChild(style);
    
    // 2. Hide logo and make description clickable immediately
    // Hide logo instead of removing
    const logo = doc.querySelector('.gh-portal-signup-logo');
    const ghostik = doc.querySelector('.gh-portal-powered');
    if (logo) logo.style.display = 'none';
    if (ghostik) ghostik.style.display = 'none';
    
    // Make description clickable - reset linkified status to ensure fresh listeners
    const descriptions = doc.querySelectorAll('.gh-portal-product-description');
    descriptions.forEach(desc => {
        // Remove existing listeners by cloning the element
        const newDesc = desc.cloneNode(true);
        desc.parentNode.replaceChild(newDesc, desc);
        
        // Add fresh listener
        newDesc.addEventListener('click', handleDescriptionClick, { once: false });
    });
}

function handleDescriptionClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple clicks
    if (isNavigating) return;
    isNavigating = true;
    
    // Open in new tab to avoid conflicts entirely
    window.open('/subscription', '_blank');
    
    // Reset the flag quickly since we're not navigating away
    setTimeout(() => {
        isNavigating = false;
    }, 1000);
}

// Debounced customization function to prevent rapid re-execution
let customizeTimeout;
function debouncedCustomize() {
    clearTimeout(customizeTimeout);
    customizeTimeout = setTimeout(customizePortal, 100);
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debouncedCustomize);
} else {
    debouncedCustomize();
}

// Listen for portal events more carefully
document.addEventListener('click', (e) => {
    // Only trigger if clicking portal trigger elements
    if (e.target.closest('[data-portal="signup"], [data-portal="signin"], .gh-portal-trigger')) {
        debouncedCustomize();
    }
});

// Also listen for Ghost portal events if available
if (window.ghost && window.ghost.portal) {
    // Listen for portal state changes
    const originalOpen = window.ghost.portal.open;
    if (originalOpen) {
        window.ghost.portal.open = function() {
            const result = originalOpen.apply(this, arguments);
            debouncedCustomize();
            return result;
        };
    }
}

// Clean up navigation flag when page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        isNavigating = false;
    }
});

})(); // End of IIFE