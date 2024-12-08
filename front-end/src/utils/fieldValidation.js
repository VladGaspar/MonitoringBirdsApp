import {regex} from '../constants/regex';
import {isAfter, isFuture} from 'date-fns'

const FieldValidation = {
    REQUIRED: 'Obligatoriu',
    INVALID_CREDENTIALS: 'invalidCredentials',
    FORMAT: 'lettersOnly',
    MIN: 'minLength',
    MAX: 'maxLength',
    PASSWORD: 'Complexitatea parolei nu respecta cerintele',
    EMAIL: 'emailFormat',
    PASSWORDS_NOT_MATCHING: 'passwordsNotMatching',
    DATES_NOT_SUCCEEDING: 'datesNotSucceeding',
    ROOM_NUMBER: 'roomNumber',
    MIN_VAL: 'minVal',
    FUTURE_DATE: 'futureDate',
};


const validateInput = (regex, errorMessage) => (value) => {
    return !regex.test(value) && errorMessage;
};

export const getValidationErrorMessage = error => {
    if (typeof error === 'string' || !error) {
        return [error];
    }

    return [error.type, error.values];
};

export class FieldValidations {

    static required(value) {
        return value != null ? undefined : FieldValidation.REQUIRED;
    }

    static composeValidators(...validators) {
        return (...value) => {
            return validators.reduce((error, validator) => error || validator(...value), undefined);
        };
    }

    static validateFormat = validateInput(new RegExp(regex.lettersOnly), FieldValidation.FORMAT);
    // static validateEmail = validateInput(new RegExp(regex.email), FieldValidation.EMAIL);
    static validatePassword = validateInput(new RegExp(regex.password), FieldValidation.PASSWORD);
    // static validateRoomNumber = validateInput(new RegExp(regex.roomNumber), FieldValidation.ROOM_NUMBER);

    static minLength = (min) => (value) => {
        if (!value || value.trim().length < min) {
            return {type: FieldValidation.MIN, values: [min]};
        }
    };

    static maxLength = (max) => (value) => {
        if (!value || value.trim().length > max) {
            return {type: FieldValidation.MAX, values: [max]};
        }
    };

    static passwordsMatch = (values) => {
        if (values.password !== undefined && values.confirmPassword !== undefined) {
            return values.password === values.confirmPassword ? undefined : FieldValidation.PASSWORDS_NOT_MATCHING;
        }
    };

    static datesSucceed = (values) => {
        if (values.startDate !== undefined && values.endDate !== undefined) {
            return isAfter(new Date(values.endDate), new Date(values.startDate))
                ? undefined
                : FieldValidation.DATES_NOT_SUCCEEDING;
        }
    };

    static minValue = (min) => (value) => {
        if (!value || Number(value) < min) {
            return {type: FieldValidation.MIN_VAL, values: [min]};
        }
    };

    static futureDate = (date) => (value) => {
        if (!value || isFuture(date)) {
            return {type: FieldValidation.FUTURE_DATE, values: [date]};
        }
    };
}

