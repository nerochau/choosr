// Background script for Choosr extension
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Choosr extension installed');
        
        // Set default settings
        chrome.storage.sync.set({
            enabled: true,
            priceWeight: 30,
            ratingWeight: 40,
            reviewWeight: 30,
            maxProducts: 5
        });
    }
});

// Update badge when on Amazon pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        if (isAmazonProductPage(tab.url)) {
            chrome.action.setBadgeText({
                tabId: tabId,
                text: '●'
            });
            chrome.action.setBadgeBackgroundColor({
                tabId: tabId,
                color: '#4a90e2'
            });
        } else {
            chrome.action.setBadgeText({
                tabId: tabId,
                text: ''
            });
        }
    }
});

// Clear badge when tab is activated
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && isAmazonProductPage(tab.url)) {
            chrome.action.setBadgeText({
                tabId: activeInfo.tabId,
                text: '●'
            });
            chrome.action.setBadgeBackgroundColor({
                tabId: activeInfo.tabId,
                color: '#4a90e2'
            });
        } else {
            chrome.action.setBadgeText({
                tabId: activeInfo.tabId,
                text: ''
            });
        }
    });
});

function isAmazonProductPage(url) {
    const amazonDomains = [
        'amazon.com',
        'amazon.co.uk',
        'amazon.ca',
        'amazon.de',
        'amazon.fr',
        'amazon.it',
        'amazon.es',
        'amazon.in',
        'amazon.com.au',
        'amazon.co.jp'
    ];
    
    return amazonDomains.some(domain => 
        url.includes(domain) && 
        (url.includes('/dp/') || url.includes('/gp/product/'))
    );
}

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        chrome.storage.sync.get([
            'priceWeight',
            'ratingWeight', 
            'reviewWeight',
            'maxProducts'
        ], (result) => {
            sendResponse({
                priceWeight: result.priceWeight || 30,
                ratingWeight: result.ratingWeight || 40,
                reviewWeight: result.reviewWeight || 30,
                maxProducts: result.maxProducts || 5
            });
        });
        return true;
    }
    
    if (request.action === 'updateSettings') {
        chrome.storage.sync.set(request.settings, () => {
            sendResponse({success: true});
        });
        return true;
    }
});