import * as React from 'react';
import {useState} from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import {Field, useField} from 'react-final-form';

import {usePrepareClassesForField} from "../hooks/usePrepareClassesForField";


export const DatePickerField = ({
                                    showIcon,
                                    selected,
                                    label,
                                    name,
                                    placeholder = label,
                                    isMandatory,
                                    isDisabled,
                                    ...props
                                }) => {
    const [date, setDate] = useState(selected);
    const {input} = useField(name, props);
    const classes = usePrepareClassesForField({isDisabled});

    return (
        <Field name={name} {...props}>
            {() => (
                <div className="block text-sm font-bold mb-2 mx-auto">
                    <label className="block mt-1 mb-2">
                        {label}
                        {isMandatory && ' *'}
                    </label>
                    <DatePicker
                        className={classes}
                        dateFormat="YYYY"
                        placeholderText={placeholder}
                        showIcon={showIcon}
                        selected={date}
                        showYearPicker
                        dropdownMode="select"
                        disabled={isDisabled}
                        onChange={(newValue) => {
                            setDate(newValue);
                            if (newValue !== null) {
                                const yearInt = newValue.getFullYear();
                                input.onChange(yearInt);
                            }
                        }}
                    />
                </div>
            )}
        </Field>
    );
};
