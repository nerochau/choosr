# Choosr - Smart Amazon Product Comparison

Choosr is a Chrome extension that helps users make smarter purchasing decisions on Amazon by comparing similar products and providing cost-benefit recommendations. It extracts product data directly from Amazon product pages, evaluates alternatives, and visually presents the top options.

---

## **Features**

- **Automatic Product Data Extraction**: Fetches product title, price, rating, reviews, and ASIN from Amazon product pages.  
- **Similar Product Recommendations**: Generates a curated list of similar products with varied pricing, ratings, and features.  
- **Cost-Benefit Scoring**: Calculates a score for each product based on price, rating, and reviews to highlight the best value option.  
- **Interactive Popup**: Displays recommended products with scores, ratings, and direct links to Amazon.  
- **Badge Indicator**: Shows a small indicator when Choosr is active on Amazon pages.  

---

## **Installation**

1. Clone or download this repository.  
2. Open Chrome and navigate to `chrome://extensions/`.  
3. Enable **Developer Mode**.  
4. Click **Load unpacked** and select the extension directory.  
5. Visit any Amazon product page to see Choosr in action.  

---

## **Usage**

1. Click the Choosr extension icon on an Amazon product page.  
2. The popup will display the current product and a list of similar products.  
3. Each recommended product includes:  
   - Title  
   - Price  
   - Rating  
   - Number of Reviews  
   - Cost-Benefit Score  
   - Direct link to Amazon  
4. The top recommended product is highlighted for quick decision-making.  

---

## **Project Structure**

- `background.js` – Handles extension installation, badge updates, and settings management.  
- `content.js` – Extracts product data from Amazon pages and injects a small activity indicator.  
- `popup.js` – Displays similar products and calculates cost-benefit scores.  
- `manifest.json` – Chrome extension configuration file.  
- `icons/` – Includes `icon16.png` and `logo.png` for extension icons.  

---

## **Customization**

Users can adjust the relative weights for price, rating, and reviews in the extension settings (currently using default weights: Price: 30%, Rating: 40%, Reviews: 30%).  

---

## **License**

This project is licensed under the MIT License.
