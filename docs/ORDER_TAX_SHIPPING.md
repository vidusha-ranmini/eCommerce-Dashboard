# Order Tax and Shipping Configuration

## Overview
The order system now includes automatic tax and shipping calculations based on configurable settings. When you change settings like `GLOBAL_TAX_RATE` or `SHIPPING_COST`, all new orders will automatically use the updated values.

## Database Changes

### New Order Fields
The `orders` table now includes:
- **subtotal** - Order subtotal before tax and shipping
- **taxRate** - Tax rate percentage (loaded from GLOBAL_TAX_RATE setting)
- **taxAmount** - Calculated tax amount (subtotal × taxRate / 100)
- **shippingCost** - Shipping cost (loaded from SHIPPING_COST setting, or 0 if free shipping applies)
- **totalAmount** - Final total (subtotal + taxAmount + shippingCost) - Auto-calculated

## Settings Configuration

### Available Settings
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| GLOBAL_TAX_RATE | number | 10 | Tax rate percentage applied to all orders |
| SHIPPING_COST | number | 5.00 | Default shipping cost |
| FREE_SHIPPING_MINIMUM | number | 50.00 | Minimum order subtotal for free shipping |
| SITE_NAME | string | E-Commerce Admin | Name of the site |
| CURRENCY_SYMBOL | string | $ | Currency symbol for display |
| ITEMS_PER_PAGE | number | 20 | Pagination size |
| LOW_STOCK_THRESHOLD | number | 10 | Stock warning threshold |
| ENABLE_REGISTRATION | boolean | true | Allow new user registrations |

### How to Update Settings
1. Login to AdminJS as admin
2. Navigate to **Configuration** > **Settings**
3. Click on the setting you want to change (e.g., GLOBAL_TAX_RATE)
4. Edit the **value** field
5. Click **Save**
6. The cache is automatically cleared and new orders will use the updated value

## Order Calculation Logic

### When Creating a New Order

1. **Load Settings** (if not manually provided):
   - Tax rate from `GLOBAL_TAX_RATE` setting
   - Shipping cost from `SHIPPING_COST` setting

2. **Apply Free Shipping Rule**:
   - If order subtotal ≥ `FREE_SHIPPING_MINIMUM`, shipping cost = 0

3. **Calculate Tax**:
   ```
   taxAmount = subtotal × (taxRate / 100)
   ```

4. **Calculate Total**:
   ```
   totalAmount = subtotal + taxAmount + shippingCost
   ```

### Example Calculation

**Scenario 1: Order with standard shipping**
- Subtotal: $30.00
- Tax Rate: 10%
- Shipping: $5.00

Calculations:
- Tax Amount = $30.00 × 0.10 = $3.00
- Total = $30.00 + $3.00 + $5.00 = **$38.00**

**Scenario 2: Order with free shipping**
- Subtotal: $60.00
- Tax Rate: 10%
- Shipping: $0.00 (free because $60 ≥ $50 minimum)

Calculations:
- Tax Amount = $60.00 × 0.10 = $6.00
- Total = $60.00 + $6.00 + $0.00 = **$66.00**

**Scenario 3: After changing tax rate to 8%**
- Subtotal: $30.00
- Tax Rate: 8% (updated in settings)
- Shipping: $5.00

Calculations:
- Tax Amount = $30.00 × 0.08 = $2.40
- Total = $30.00 + $2.40 + $5.00 = **$37.40**

## AdminJS Interface

### Order Form
When creating or editing an order in AdminJS:

**Required Fields:**
- User (dropdown selection)
- Subtotal (enter the order subtotal)
- Shipping Address
- Payment Method (Cash, Credit Card, PayPal)

**Auto-Populated Fields:**
- Order Number (auto-generated)
- Tax Rate (from settings, can be overridden)
- Shipping Cost (from settings, can be overridden)

**Calculated Fields (read-only):**
- Tax Amount
- Total Amount

**Optional Fields:**
- Notes

### Order List View
The order list shows:
- Order ID
- Order Number
- Subtotal
- Total Amount
- Status
- Payment Method
- Payment Status
- Created At

### Order Detail View
Shows all fields including:
- Breakdown of subtotal, tax, shipping
- Tax rate used
- Full shipping address
- Notes

## Settings Cache

The system uses a 1-minute cache for settings to improve performance. The cache is automatically cleared when:
- Any setting is updated via AdminJS
- The `clearSettingsCache()` function is called

## Migration Scripts

### Scripts Created
1. **addOrderFields.js** - Adds new fields to orders table
2. **seedSettings.js** - Creates default settings

### Running Migrations
```bash
# Add new order fields
npm run migrate:order-fields

# Seed default settings
npm run seed:settings
```

## Testing the Feature

1. **Update Tax Rate**:
   - Go to Settings
   - Edit GLOBAL_TAX_RATE (e.g., change to 8)
   - Save

2. **Create Test Order**:
   - Go to Orders > Create New
   - Select a user
   - Enter subtotal: 100
   - Enter shipping address
   - Select payment method
   - Save

3. **Verify Calculations**:
   - Tax should be $8.00 (100 × 0.08)
   - If shipping is $5, total should be $113.00
   - Check the order detail view to see the breakdown

4. **Test Free Shipping**:
   - Create another order with subtotal: 60
   - Shipping should automatically be $0 (because 60 ≥ 50)
   - Tax should be $4.80 (60 × 0.08)
   - Total should be $64.80

## Utility Functions

### Using Settings in Code
```javascript
import { getSetting, updateSetting, getAllSettings } from './utils/settings.js';

// Get a single setting
const taxRate = await getSetting('GLOBAL_TAX_RATE', 10);

// Update a setting
await updateSetting('GLOBAL_TAX_RATE', 8);

// Get all settings as object
const settings = await getAllSettings();
console.log(settings.SITE_NAME); // "E-Commerce Admin"
```

## Notes

- All existing orders remain unchanged
- New orders automatically use current settings
- Tax and shipping can be manually overridden when creating/editing orders
- Total amount is always recalculated before saving
- Settings cache refreshes every 60 seconds or on update
