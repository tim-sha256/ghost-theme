// Save this as /assets/js/portal-customization.js

function customizePortal() {
    const portalFrame = document.querySelector('iframe[data-frame="portal-popup"], iframe[title*="portal"]');
    
    if (!portalFrame?.contentDocument) {
        setTimeout(customizePortal, 500);
        return;
    }
    
    const doc = portalFrame.contentDocument;
    
    // Check if already customized
    if (doc.getElementById('custom-portal-styles')) return;
    
    // 1. Add font and remove border radius
    const style = doc.createElement('style');
    style.id = 'custom-portal-styles';
    style.textContent = `
        @font-face {
            font-family: 'Iosevka Custom';
            src: url('/assets/fonts/IosevkaCustom-Regular.woff2') format('woff2');
        }
        * { 
            font-family: 'Iosevka Custom', monospace !important;
            border-radius: 0 !important;
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
            background-color: var(--ghost-accent-color) !important;
            text-decoration: none !important;
        }
    `;
    doc.head.appendChild(style);
    
    // 2. Remove logo and make description clickable
    setTimeout(() => {
        // Remove logo
        const logo = doc.querySelector('.gh-portal-signup-logo');
        const ghostik = doc.querySelector('.gh-portal-powered');
        if (logo) logo.remove();
        if (ghostik) ghostik.remove();
        
        // Make description clickable
        const descriptions = doc.querySelectorAll('.gh-portal-product-description');
        descriptions.forEach(desc => {
            if (!desc.dataset.linkified) {
                desc.dataset.linkified = 'true';
                desc.addEventListener('click', () => {
                    window.location.href = '/subscription';
                });
            }
        });
    }, 100);
}

// Start when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', customizePortal);
} else {
    customizePortal();
}

// Re-apply when portal opens
document.addEventListener('click', (e) => {
    if (e.target.closest('[data-portal]')) {
        setTimeout(customizePortal, 300);
    }
});