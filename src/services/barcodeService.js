/**
 * Service to interact with the Open Food Facts API for barcode lookups.
 * Documentation: https://openfoodfacts.github.io/api-documentation/
 */

const OFF_API_BASE = 'https://world.openfoodfacts.org/api/v2/product';

/**
 * Looks up a product by its barcode (EAN-13, UPC-A, etc.)
 * @param {string} barcode - The scanned barcode
 * @returns {Promise<Object|null>} Product details or null if not found
 */
export const lookupBarcode = async (barcode) => {
  if (!barcode) return null;

  try {
    const response = await fetch(`${OFF_API_BASE}/${barcode}.json`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return { found: false, error: 'Product not found in database.' };
      }
      throw new Error(`Open Food Facts API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 1 && data.product) {
      // Extract the most useful fields for our AI prompt
      const productName = data.product.product_name || data.product.product_name_en;
      const brand = data.product.brands ? data.product.brands.split(',')[0] : '';
      
      const fullName = brand && productName 
        ? `${brand} ${productName}`.trim()
        : (productName || brand || 'Unknown Product');

      return {
        found: true,
        barcode: data.product.code,
        fullName: fullName,
        brand: brand,
        productName: productName,
        image: data.product.image_front_url || data.product.image_url,
      };
    }

    return { found: false, error: 'Product not found in database.' };

  } catch (error) {
    console.error('Barcode lookup failed:', error);
    return { found: false, error: 'Failed to connect to product database.' };
  }
};
