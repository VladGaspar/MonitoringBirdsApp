import {Field, useField} from 'react-final-form';
import {usePrepareClassesForField} from "../hooks/usePrepareClassesForField";
import useShowFieldError from "../hooks/useShowFieldError";


export const TextField = ({
                              label,
                              name,
                              placeholder = label,
                              type = 'text',
                              isMandatory,
                              isDisabled,
                              className,
                              min,
                              ...props
                          }) => {
    const {input, meta} = useField(name, {
        validate: props.validate
    });
    const {errorTranslation, shouldShowError} = useShowFieldError(meta);
    const classes = usePrepareClassesForField({isDisabled, shouldShowError});

    return (
        <Field name={name} {...props} subscription={{touched: true, error: true, value: true}}>
            {() => (
                <div className={className + ' block text-sm font-bold mb-2'}>
                    <label className="block my-2">
                        {label}
                        {isMandatory && ' *'}
                    </label>
                    <input {...input} type={type} placeholder={placeholder} disabled={isDisabled} min={min}
                           className={classes}/>
                    {shouldShowError && (
                        <div
                            className="mt-2 text-error text-xs italic font-light whitespace-normal break-normal text-red-700">
                            {errorTranslation}
                        </div>
                    )}
                </div>
            )}
        </Field>
    );
};
