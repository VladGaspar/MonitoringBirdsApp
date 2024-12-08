import {Field, useField} from 'react-final-form';
import {AsyncPaginate} from 'react-select-async-paginate';
import useShowFieldError from "../hooks/useShowFieldError";


const PaginatedAsyncSelect = ({
                                  name,
                                  label,
                                  placeholder,
                                  isMulti,
                                  isClearable,
                                  isMandatory,
                                  isDisabled,
                                  onLoadOptions,
                                  onChange,
                                  ...props
                              }) => {
    const {meta} = useField(name);
    const {errorTranslation, shouldShowError} = useShowFieldError(meta);


    return (
        <Field name={name} {...props} subscription={{touched: true, error: true}}>
            {() => (
                <div className="block text-sm font-bold mb-2">
                    <label className="block my-2">
                        {label}
                        {isMandatory && ' *'}
                    </label>
                    <AsyncPaginate
                        placeholder={placeholder}
                        isMulti={isMulti}
                        isDisabled={isDisabled}
                        isClearable={isClearable}
                        loadOptions={onLoadOptions}
                        onChange={onChange}
                        styles={meta.error && meta.touched}
                        additional={{
                            page: 0,
                        }}
                    />
                    {shouldShowError &&
                        <div className="mt-2 text-error text-xs italic font-light">{errorTranslation}</div>}
                </div>
            )}
        </Field>
    );
};

export default PaginatedAsyncSelect;
