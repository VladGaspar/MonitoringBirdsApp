/**
 * Declares keys to be used in localStorage
 * Can be exported to be used as a global constant inside the project, but the functions already offer autocomplete
 *
 * @example loginCode : 'authLogin'
 */
const storageKeys = {
    authSlice: 'auth',
    language: 'i18nextLng',
    features: 'features',
    sidebar: 'isSidebarExpanded',
    filterValues: 'filterValues',
};

/**
 * Defines types of data stored at provided keys
 *
 * @example[storageKeys.loginCode]: Interface | null
 */

/**
 * Defines default values for each value in the localStorage
 *
 * @example authLogin: null
 */
const defaultValues = {
    auth: null,
    i18nextLng: 'en',
    features: {},
    isSidebarExpanded: false,
    filterValues: null,
};

// export type TLocalStorageKey = (typeof storageKeys)[keyof typeof storageKeys];

/**
 * Wrapper over localStorage with Typescript support
 *
 * @example StorageUtils.getLocalStorageValue('authLogin')
 */
export default class StorageUtils {
    /**
     * Retrieves value stored locally for {@param key} or returns provided/above defined default value
     *
     * @param key
     * @param defaultValue
     * @param typeCast
     */
    static getLocalStorageValue(
        key,
        defaultValue = defaultValues[key]
    ) {
        try {
            const item = localStorage.getItem(key);
            if (item && !item.includes('{') && !['false', 'true'].includes(item)) return item;

            const value = JSON.parse(item || '');
            if (value != null) return value;
        } catch (e) {
            // do nothing
        }

        return defaultValue;
    }

    /**
     * Updates value for {@param key} on local storage
     * @param key
     * @param value
     */
    static setLocalStorageValue(key, value) {
        localStorage.setItem(key, value === 'string' ? value : JSON.stringify(value));
    }

    /**
     * Removes provided key from storage
     * @param key
     */
    static removeLocalStorageValue(key) {
        localStorage.removeItem(key);
    }
}
