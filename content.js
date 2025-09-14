// Content script for extracting Amazon product data
(function() {
    'use strict';

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'getProductData') {
            const productData = extractProductData();
            sendResponse({
                success: !!productData,
                data: productData
            });
        }
        return true; // Keep message channel open for async response
    });

    function extractProductData() {
        try {
            // Extract product information from various Amazon page elements
            const title = extractTitle();
            const price = extractPrice();
            const rating = extractRating();
            const reviews = extractReviewCount();
            const asin = extractASIN();

            if (!title) {
                console.log('Could not extract product title');
                return null;
            }

            return {
                title: title,
                price: price,
                rating: rating,
                reviews: reviews,
                asin: asin,
                url: window.location.href
            };
        } catch (error) {
            console.error('Error extracting product data:', error);
            return null;
        }
    }

    function extractTitle() {
        const selectors = [
            '#productTitle',
            '.product-title',
            '[data-automation-id="product-title"]',
            'h1.a-size-large',
            'h1 span'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return null;
    }

    function extractPrice() {
        const selectors = [
            '.a-price-whole',
            '.a-offscreen',
            '.a-price .a-offscreen',
            '.a-price-symbol + .a-price-whole',
            '[data-automation-id="price"] .a-price-whole',
            '.a-price-range .a-offscreen'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent) {
                const priceText = element.textContent.replace(/[$,]/g, '').trim();
                const price = parseFloat(priceText);
                if (!isNaN(price) && price > 0) {
                    return price;
                }
            }
        }

        // Try to extract from any element containing price-like text
        const priceRegex = /\$[\d,]+\.?\d*/;
        const bodyText = document.body.textContent;
        const priceMatch = bodyText.match(priceRegex);
        
        if (priceMatch) {
            const price = parseFloat(priceMatch[0].replace(/[$,]/g, ''));
            if (!isNaN(price) && price > 0) {
                return price;
            }
        }

        return null;
    }

    function extractRating() {
        const selectors = [
            '[data-hook="average-star-rating"] .a-icon-alt',
            '.a-icon-star .a-icon-alt',
            '[aria-label*="stars"]',
            '.reviewCountTextLinkedHistogram .a-icon-alt'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                const ratingText = element.textContent || element.getAttribute('aria-label') || '';
                const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
                if (ratingMatch) {
                    const rating = parseFloat(ratingMatch[1]);
                    if (!isNaN(rating) && rating >= 0 && rating <= 5) {
                        return rating;
                    }
                }
            }
        }

        return null;
    }

    function extractReviewCount() {
        const selectors = [
            '[data-hook="total-review-count"]',
            '#acrCustomerReviewText',
            '.a-link-normal[href*="#customerReviews"]',
            '[data-automation-id="reviews-block"] a'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent) {
                const reviewText = element.textContent.replace(/[,\s]/g, '');
                const reviewMatch = reviewText.match(/(\d+)/);
                if (reviewMatch) {
                    const reviewCount = parseInt(reviewMatch[1]);
                    if (!isNaN(reviewCount) && reviewCount >= 0) {
                        return reviewCount;
                    }
                }
            }
        }

        return null;
    }

    function extractASIN() {
        // Try to get ASIN from URL
        const urlMatch = window.location.href.match(/\/dp\/([A-Z0-9]{10})/);
        if (urlMatch) {
            return urlMatch[1];
        }

        // Try to get ASIN from page elements
        const asinElements = document.querySelectorAll('[data-asin]');
        if (asinElements.length > 0) {
            return asinElements[0].getAttribute('data-asin');
        }

        // Try to find ASIN in scripts or meta tags
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            const scriptText = script.textContent;
            const asinMatch = scriptText.match(/"asin":"([A-Z0-9]{10})"/);
            if (asinMatch) {
                return asinMatch[1];
            }
        }

        return null;
    }

    // Inject a small indicator that Choosr is active (optional)
    function injectIndicator() {
        if (document.querySelector('#choosr-indicator')) return;

        const indicator = document.createElement('div');
        indicator.id = 'choosr-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #4a90e2, #667eea);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0.9;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        indicator.textContent = '🔍 Choosr Active';
        
        indicator.addEventListener('mouseenter', () => {
            indicator.style.opacity = '1';
            indicator.style.transform = 'scale(1.05)';
        });
        
        indicator.addEventListener('mouseleave', () => {
            indicator.style.opacity = '0.9';
            indicator.style.transform = 'scale(1)';
        });

        document.body.appendChild(indicator);

        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.style.opacity = '0';
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(injectIndicator, 1000);
        });
    } else {
        setTimeout(injectIndicator, 1000);
    }

})();