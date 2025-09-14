document.addEventListener('DOMContentLoaded', async function() {
    const statusEl = document.getElementById('status');
    const productsContainer = document.getElementById('products-container');
    
    try {
        // Get current tab
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        
        if (!tab.url.includes('amazon.')) {
            showStatus('Please visit an Amazon product page', 'error');
            return;
        }

        // Get product data from content script
        const response = await chrome.tabs.sendMessage(tab.id, {action: 'getProductData'});
        
        if (!response || !response.success) {
            showStatus('Could not analyze this product. Please try refreshing the page.', 'error');
            return;
        }

        // Show current product info
        showStatus('Finding similar products...', 'loading');
        
        // Simulate API call delay and generate similar products
        setTimeout(() => {
            const similarProducts = generateSimilarProducts(response.data);
            displayProducts(similarProducts);
        }, 2000);
        
    } catch (error) {
        console.error('Popup error:', error);
        showStatus('An error occurred. Please try again.', 'error');
    }
});

function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('status');
    const productsContainer = document.getElementById('products-container');
    
    if (type === 'loading') {
        statusEl.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <span>${message}</span>
            </div>
        `;
        statusEl.className = 'status';
    } else if (type === 'error') {
        statusEl.innerHTML = message;
        statusEl.className = 'status error';
        productsContainer.innerHTML = '';
    } else {
        statusEl.innerHTML = message;
        statusEl.className = 'status';
    }
}

function generateSimilarProducts(currentProduct) {
    const basePrice = currentProduct.price || 25.99;
    const baseName = currentProduct.title || 'Product';
    
    // Generate similar products with varied pricing and features
    const variations = [
        {
            titleSuffix: ' Pro',
            priceMultiplier: 1.3,
            ratingBonus: 0.2,
            reviewsMultiplier: 0.8,
            features: ['Premium Quality', 'Extended Warranty']
        },
        {
            titleSuffix: ' Lite',
            priceMultiplier: 0.7,
            ratingBonus: -0.1,
            reviewsMultiplier: 1.2,
            features: ['Budget Friendly', 'Basic Features']
        },
        {
            titleSuffix: ' Premium',
            priceMultiplier: 1.6,
            ratingBonus: 0.3,
            reviewsMultiplier: 0.6,
            features: ['Top Rated', 'Premium Materials']
        },
        {
            titleSuffix: ' Standard',
            priceMultiplier: 0.9,
            ratingBonus: 0.0,
            reviewsMultiplier: 1.1,
            features: ['Good Value', 'Reliable']
        },
        {
            titleSuffix: ' Deluxe',
            priceMultiplier: 1.4,
            ratingBonus: 0.25,
            reviewsMultiplier: 0.7,
            features: ['Enhanced Features', 'Popular Choice']
        }
    ];

    const products = variations.map((variant, index) => {
        const price = (basePrice * variant.priceMultiplier).toFixed(2);
        const rating = Math.min(5.0, Math.max(3.0, (currentProduct.rating || 4.0) + variant.ratingBonus));
        const reviews = Math.floor((currentProduct.reviews || 100) * variant.reviewsMultiplier);
        
        const product = {
            title: (baseName + variant.titleSuffix).substring(0, 80) + '...',
            price: parseFloat(price),
            rating: Math.round(rating * 10) / 10,
            reviews: reviews,
            features: variant.features,
            url: `https://amazon.com/dp/EXAMPLE${index + 1}`
        };

        // Calculate cost-benefit score
        product.score = calculateCostBenefitScore(product, basePrice);
        
        return product;
    });

    // Sort by score (highest first) and mark the top one as recommended
    products.sort((a, b) => b.score - a.score);
    products[0].recommended = true;

    return products;
}

function calculateCostBenefitScore(product, basePrice) {
    // Balanced formula considering price, rating, and reviews
    const priceScore = Math.max(0, (basePrice * 2 - product.price) / basePrice) * 30; // Lower price = higher score
    const ratingScore = (product.rating / 5) * 40; // Rating out of 5, weighted 40%
    const reviewScore = Math.min(30, Math.log10(product.reviews + 1) * 10); // Reviews factor, capped at 30%
    
    return Math.min(100, priceScore + ratingScore + reviewScore);
}

function displayProducts(products) {
    const statusEl = document.getElementById('status');
    const productsContainer = document.getElementById('products-container');
    
    statusEl.style.display = 'none';
    
    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <h3>No similar products found</h3>
                <p>Try visiting a different product page or check back later.</p>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card ${product.recommended ? 'recommended' : ''}">
            <div class="product-title">${product.title}</div>
            <div class="product-details">
                <div class="product-price">$${product.price}</div>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                    <span>${product.rating}</span>
                    <span>(${product.reviews.toLocaleString()})</span>
                </div>
            </div>
            <div class="score-bar">
                <div class="score-fill" style="width: ${product.score}%"></div>
            </div>
            <div class="score-label">Cost-Benefit Score: ${Math.round(product.score)}/100</div>
            <a href="${product.url}" target="_blank" class="product-link">View on Amazon</a>
        </div>
    `).join('');

    // Animate score bars
    setTimeout(() => {
        document.querySelectorAll('.score-fill').forEach(fill => {
            fill.style.width = fill.style.width;
        });
    }, 100);
}