import {Loader} from "./Loader";
import {MdDownload} from "react-icons/md";
import {Button} from "../button/Button";
import React, {useEffect} from "react";
import useGetUsersReportDownloadLink from "../hooks/useGetObservationReports";
import {Form} from "react-final-form";
import {TextField} from "../form/TextFiled";


const UserInfo = ({userData}) => {
    const {downloadLink, isLoading, loadDownloadLink} = useGetUsersReportDownloadLink();

    useEffect(() => {
        if (downloadLink) {
            window.location.href = downloadLink;
        }
    }, [downloadLink]);

    async function onSubmit(values) {

    }

    const initialData = {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        noOfObservation: userData.noOfObservation,
        distinctBirds: userData.distinctBirds
    }

    return (
        <div
            className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-4 transform transition duration-500">
            <h1 className="text-4xl font-bold text-black mb-4 text-center">Contul Meu</h1>
            <div className="w-full h-full overflow-auto">
                <Form
                    onSubmit={onSubmit}
                    initialValues={initialData}
                    subscription={{
                        pristine: true,
                        submitting: true,
                        values: true,
                    }}
                    render={({handleSubmit, submitting, pristine, values}) => {
                        return (
                            <form
                                onSubmit={handleSubmit}
                                className="mx-auto bg-white  rounded-xl px-8 py-4 my-6 h-fit min-w-[50%] max-w-2xl whitespace-pre"
                            >
                                <div className="grid col-auto gap-4 grid-flow-row-dense mb-2">
                                    <div className="grid md:grid-cols-2 md:gap-6">
                                        <TextField
                                            name="firstName"
                                            label={'Prenume'}
                                            placeholder={'Prenume'}
                                            isDisabled={true}
                                        />
                                        <TextField
                                            name="lastName"
                                            label={'Nume'}
                                            isDisabled={true}
                                            placeholder={'Nume'}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 md:gap-6">
                                        <TextField
                                            name="username"
                                            label={'Nume de utilizator'}
                                            isDisabled={true}
                                            placeholder={'Nume de utilizator'}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 md:gap-6">
                                        <TextField
                                            name="noOfObservation"
                                            type="number"
                                            isDisabled={true}
                                            label={'Număr de observații totale'}
                                            placeholder={'Număr de observații totale'}
                                        />
                                        <TextField
                                            type="number"
                                            name="distinctBirds"
                                            isDisabled={true}
                                            label={'Număr de specii observate'}
                                            placeholder={'Număr de specii observate'}
                                        />
                                    </div>
                                </div>
                            </form>
                        );
                    }}
                />
            </div>
            <Button onClick={loadDownloadLink}
                    className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-cyan-600 text-white hover:bg-cyan-800 hover:text-white inline-flex items-center justify-center">
                <p className='mr-1'>Descarcă observațiile tale</p>
                {isLoading ? <Loader isLoading={isLoading} size={20}/> : <MdDownload/>}
            </Button>
        </div>
    );
}
export default UserInfo;
