import {format} from 'date-fns';
import {enGB, ro} from 'date-fns/locale';
import {registerLocale} from 'react-datepicker';

const SUPPORTED_LOCALES = {
    en: enGB,
    ro,
};
/**
 * Proxy for date-fns format method, in order to perform appropriate translation for dates
 * @param date
 * @param dateFormat
 */
export const formatDate = (date, dateFormat = 'yyyy-MM-dd') => {
    return format(date, dateFormat);
};

/**
 * Proxy for date-fns registerLocale method, in order to perform appropriate translation for the datepicker
 * @param language
 */
const addDatepickerLocale = (language) => {
    registerLocale(language, SUPPORTED_LOCALES[language]);
};

addDatepickerLocale('en');
addDatepickerLocale('ro');
