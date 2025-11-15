import { Setting } from '../models/index.js';

// Cache for settings to avoid repeated database queries
const settingsCache = new Map();
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 1 minute

/**
 * Get a setting value by key
 * @param {string} key - Setting key
 * @param {any} defaultValue - Default value if setting not found
 * @returns {Promise<any>} Setting value
 */
export async function getSetting(key, defaultValue = null) {
  try {
    // Check cache
    const now = Date.now();
    if (cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION && settingsCache.has(key)) {
      return settingsCache.get(key);
    }
    
    // Fetch from database
    const setting = await Setting.findOne({ where: { key } });
    
    if (!setting) {
      return defaultValue;
    }
    
    // Parse value based on type
    let value;
    switch (setting.type) {
      case 'number':
        value = parseFloat(setting.value);
        break;
      case 'boolean':
        value = setting.value === 'true' || setting.value === '1';
        break;
      case 'json':
        value = JSON.parse(setting.value);
        break;
      default:
        value = setting.value;
    }
    
    // Update cache
    settingsCache.set(key, value);
    if (!cacheTimestamp) {
      cacheTimestamp = now;
    }
    
    return value;
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Update a setting value
 * @param {string} key - Setting key
 * @param {any} value - New value
 * @returns {Promise<boolean>} Success status
 */
export async function updateSetting(key, value) {
  try {
    const setting = await Setting.findOne({ where: { key } });
    
    if (!setting) {
      throw new Error(`Setting ${key} not found`);
    }
    
    // Convert value to string based on type
    let stringValue;
    switch (setting.type) {
      case 'json':
        stringValue = JSON.stringify(value);
        break;
      default:
        stringValue = String(value);
    }
    
    await setting.update({ value: stringValue });
    
    // Clear cache
    settingsCache.clear();
    cacheTimestamp = null;
    
    console.log(`✅ Updated setting ${key} to ${stringValue}`);
    return true;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return false;
  }
}

/**
 * Get all settings as an object
 * @returns {Promise<Object>} All settings
 */
export async function getAllSettings() {
  try {
    const settings = await Setting.findAll();
    const result = {};
    
    settings.forEach(setting => {
      let value;
      switch (setting.type) {
        case 'number':
          value = parseFloat(setting.value);
          break;
        case 'boolean':
          value = setting.value === 'true' || setting.value === '1';
          break;
        case 'json':
          value = JSON.parse(setting.value);
          break;
        default:
          value = setting.value;
      }
      result[setting.key] = value;
    });
    
    return result;
  } catch (error) {
    console.error('Error getting all settings:', error);
    return {};
  }
}

/**
 * Clear the settings cache
 */
export function clearSettingsCache() {
  settingsCache.clear();
  cacheTimestamp = null;
}
