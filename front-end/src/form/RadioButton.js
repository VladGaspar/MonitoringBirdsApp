import {Field} from 'react-final-form';

export const RadioButton = ({name, label, value, ...props}) => {

    return (
        <div>
            <Field name={name} type="radio" value={value}>
                {({input}) => {
                    return (
                        <>
                            <input
                                name={input.name}
                                type="radio"
                                value={value}
                                checked={input.checked}
                                onDoubleClick={() => input.onChange(undefined)}
                                onChange={input.onChange}
                            />
                            <label className="mr-2 italic text-sm mx-2" htmlFor={name}>
                                {label}
                            </label>
                        </>
                    );
                }}
            </Field>
        </div>
    );
};
