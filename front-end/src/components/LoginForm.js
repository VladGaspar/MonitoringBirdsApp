import React, {useState} from 'react';
import {Form} from 'react-final-form';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import {appRoutes} from '../routes/appRoutes';

import {authActions} from '../store/authSlice';
import {TextField} from "../form/TextFiled";
import {Button} from "../button/Button";
import {authApi} from "../api/authApi";
import {FieldValidations} from "../utils/fieldValidation";


export const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    async function onSubmit(values) {
        const trimmedValues = {
            username: values.username.trim(),
            password: values.password.trim(),
        };

        authApi
            .handleLogin(trimmedValues)
            .then(response => {
                dispatch(authActions.login(response));
                navigate(appRoutes.home);
            })
            .catch(error => {
                setError(error)
            });

    }

    return (
        <Form
            onSubmit={onSubmit}
            render={({handleSubmit, submitting}) => (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 h-fit mt-16 w-80 whitespace-pre"
                >
                    <div className="mb-4">
                        <div>
                            <TextField
                                label={'Nume de utilizator'}
                                name="username"
                                placeholder={'Introduceti numele de utilizator...'}
                                type="text"
                                validate={FieldValidations.required}
                            />
                        </div>
                        <div>
                            <TextField
                                label={'Parola'}
                                name="password"
                                placeholder={'Introduceti parola...'}
                                type="password"
                                validate={FieldValidations.required}
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="text-error text-sm font-light italic text-center py-1 my-4 text-red-700">
                            {'Parola sau adresa sunt invalide.\nTe rugăm completează din nou.'}
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <Button type={'submit'} disabled={submitting}>
                            {'Login'}
                        </Button>
                    </div>
                </form>
            )}
        />
    );
};
