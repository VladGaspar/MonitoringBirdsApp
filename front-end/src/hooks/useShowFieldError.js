const getValidationErrorMessage = error => {
    if (typeof error === 'string' || !error) {
        return [error];
    }

    return [error.type, error.values];
};
export default function useShowFieldError(meta) {
    const [errorKey] = getValidationErrorMessage(meta.error);
    const shouldShowError = !!errorKey && meta.touched;
    const errorTranslation = shouldShowError ? errorKey : null;

    return {errorTranslation, shouldShowError};
}
