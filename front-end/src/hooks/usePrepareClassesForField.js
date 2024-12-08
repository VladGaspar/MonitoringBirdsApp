export function usePrepareClassesForField({isDisabled, shouldShowError, otherClasses}) {
    let classes =
        'w-full px-3 py-2 font-normal appearance-none rounded leading-tight shadow drop-shadow-md outline-none focus:outline-none focus:border focus:border-black';
    if (shouldShowError) {
        classes += ' border border-error';
    }
    if (isDisabled === true) {
        classes += ' cursor-not-allowed';
    }
    if (otherClasses) {
        classes += ` ${otherClasses}`;
    }

    return classes;
}
