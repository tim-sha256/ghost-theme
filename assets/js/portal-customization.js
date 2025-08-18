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
    `;
    doc.head.appendChild(style);
    
    // 2. Add "More details" link
    setTimeout(() => {
        const productsSection = doc.querySelector('.gh-portal-products');
        const productsGrid = doc.querySelector('.gh-portal-products-grid');
        
        if (productsSection && productsGrid && !doc.querySelector('.more-details-link')) {
            const link = doc.createElement('a');
            link.className = 'more-details-link';
            link.href = '/subscription';
            link.target = '_parent';
            link.textContent = 'More details';
            link.style.cssText = 'display: block; text-align: center; margin: 15px 0; color: var(--brandcolor); text-decoration: underline;';
            
            productsSection.insertBefore(link, productsGrid);
        }
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