import * as React from 'react';
import {useState} from 'react';
import {Form, FormSpy} from 'react-final-form';

import {NavLink, useNavigate} from 'react-router-dom';
import {authApi} from "../api/authApi";
import {appRoutes} from "../routes/appRoutes";
import {Button} from "../button/Button";
import {TextField} from "../form/TextFiled";
import {PasswordTooltip} from "../components/PasswordTooltip";
import {FieldValidations, getValidationErrorMessage} from "../utils/fieldValidation";

export const Register = () => {
    const navigate = useNavigate();
    const [passwordsMismatchMessage, setPasswordsMismatchMessage] = useState('');
    const [password, setPassword] = useState();

    async function onSubmit(values) {
        authApi
            .handleRegister(values)
            .then(() => navigate(appRoutes.account.login))
    }

    function handleFormChange(props) {
        const [errorMessage] = getValidationErrorMessage(FieldValidations.passwordsMatch(props.values));
        setPassword(props.values.password);
        setPasswordsMismatchMessage(errorMessage || '');
    }


    return (
        <div className="w-full h-full overflow-auto">
            <Form
                onSubmit={onSubmit}
                subscription={{
                    pristine: true,
                    submitting: true,
                    values: true,
                }}
                render={({handleSubmit, submitting, pristine, values}) => {
                    return (
                        <form
                            onSubmit={handleSubmit}
                            className="mx-auto bg-white shadow-md rounded-xl px-8 py-4 my-6 h-fit min-w-[50%] max-w-2xl whitespace-pre"
                        >
                            <div className="grid col-auto gap-4 grid-flow-row-dense mb-2">
                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <TextField
                                        isMandatory
                                        name="firstName"
                                        label={'Prenume'}
                                        placeholder={'Introduceti prenumele'}
                                        validate={FieldValidations.composeValidators(
                                            FieldValidations.required,
                                            FieldValidations.validateFormat,
                                            FieldValidations.minLength(2),
                                            FieldValidations.maxLength(30)
                                        )}
                                    />
                                    <TextField
                                        isMandatory
                                        name="lastName"
                                        label={'Nume'}
                                        placeholder={'Introduceti numele'}
                                        validate={FieldValidations.composeValidators(
                                            FieldValidations.required,
                                            FieldValidations.validateFormat,
                                            FieldValidations.minLength(2),
                                            FieldValidations.maxLength(30)
                                        )}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <TextField
                                        isMandatory
                                        name="username"
                                        label={'Nume de utilizator'}
                                        placeholder={'Introduceti un nume de utilizator'}
                                        validate={FieldValidations.composeValidators(
                                            FieldValidations.required,
                                            FieldValidations.validateFormat,
                                            FieldValidations.minLength(4),
                                            FieldValidations.maxLength(30)
                                        )}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <TextField
                                        isMandatory
                                        name="password"
                                        type="password"
                                        label={'Parola'}
                                        placeholder={'Introduceti o parola'}
                                        validate={FieldValidations.composeValidators(
                                            FieldValidations.required,
                                            FieldValidations.validatePassword
                                        )}
                                    />
                                    <PasswordTooltip anchorSelect="[name='password']" value={password}/>
                                    <TextField
                                        isMandatory
                                        type="password"
                                        name="confirmPassword"
                                        validate={FieldValidations.required}
                                        label={'Confirmati parola'}
                                        placeholder={'Confirmati parola'}
                                    />
                                    {passwordsMismatchMessage && (
                                        <div className="text-error text-xs italic font-light text-red-700">
                                            {'Parolele nu corespund'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span>{'Ai deja cont?'}</span>
                                    <NavLink
                                        to={appRoutes.account.login}
                                        className="inline-block align-baseline font-bold text-primary hover:text-secondary ml-2"
                                    >
                                        {'Login'}
                                    </NavLink>
                                </div>
                                <Button type={'submit'} disabled={submitting || pristine}>
                                    {'Trimiteti'}
                                </Button>
                            </div>
                            <FormSpy
                                subscription={{values: true, pristine: true}}
                                onChange={(props) => handleFormChange(props)}
                            />
                        </form>
                    );
                }}
            />
        </div>
    );
};

export default Register;
