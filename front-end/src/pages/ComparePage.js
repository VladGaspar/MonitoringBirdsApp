import {useEffect, useState} from "react";
import {userApi} from "../api/userApi";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "../@/components/ui/table";
import TableHeaderItem from "../components/TabelHeaderItem";
import {Form} from "react-final-form";
import {TextField} from "../form/TextFiled";
import {Button} from "../button/Button";
import {Loader} from "../components/Loader";
import RarityChart from "../components/RarityChart";
import _ from "lodash";

export default function ComparePage() {
    const initialState = {username: '', commonNo: 0, uncommonNo: 0, rareNo: 0, totalScore: 0, birds: []};
    const [myAccount, setMyAccount] = useState(initialState);
    const [comparisonAccount, setComparisonAccount] = useState(initialState);
    const [isLoadingMyAccount, setIsLoadingMyAccount] = useState(false);
    const [isLoadingComparisonAccount, setIsLoadingComparisonAccount] = useState(false);
    const [error, setError] = useState();

    const toggleKeyState = (form) => {
        form.reset()
    }

    const fetchMyAccount = () => {
        setIsLoadingMyAccount(true);
        userApi.getCompareMe()
            .then(res => setMyAccount(res.data))
            .catch(() => 'Failed to fetch compare Me:', error)
            .finally(() => setIsLoadingMyAccount(false))
    };

    useEffect(() => {
        fetchMyAccount();
    }, []);

    const onSubmit = (values) => {
        setIsLoadingComparisonAccount(true);
        const fetchComparisonAccount = () => {
            setIsLoadingComparisonAccount(true);
            userApi.getCompareUsers({username: values.username})
                .then(res => {
                    setError(undefined)
                    setComparisonAccount(res.data)
                })
                .catch(error => {
                    setError(error)
                    setComparisonAccount(initialState)
                })
                .finally(() => setIsLoadingComparisonAccount(false))
        };
        fetchComparisonAccount();
    };

    const parseRarity = (rarity) => {
        // eslint-disable-next-line default-case
        switch (rarity) {
            case "NO_RARITY":
                return "-"
            case "RARE":
                return "Rar"
            case "COMMON":
                return "Foarte Comun"
            case "UNCOMMON":
                return "Comun"
        }
    }


    return (
        <div className='flex flex-col items-center w-full h-full bg-gray-100 overflow-x-scroll rounded-lg'>
            <div className='w-full p-4 '>
                <Form
                    onSubmit={onSubmit}
                    render={({handleSubmit, form}) => (
                        <form onSubmit={handleSubmit}
                              className="w-full max-w-3xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <h1 className="text-4xl font-bold text-center mb-6">Comparație</h1>
                                <TextField
                                    label="Nume de utilizator"
                                    name="username"
                                    placeholder="Introduceti numele de utlizator..."
                                    type="text"
                                    className="w-full"
                                />
                            </div>
                            {error &&
                                <p className="text-red-700 italic mb-2">Nu s-a putut gasi un utilizator cu acest nume,
                                    va rugam incercati din nou!</p>}
                            <div className="flex justify-between">
                                <Button type="submit">
                                    Trimite
                                </Button>
                                <Button type="reset" textButton onClick={() => toggleKeyState(form)}>
                                    Anuleaza
                                </Button>
                            </div>
                        </form>
                    )}
                />
            </div>
            <div className='w-full max-w-3xl mx-auto px-4 bg-white h-full rounded-lg'>
                <div className='flex w-full justify-around'>
                    <div className=" w-1/2 p-4">
                        <Loader isLoading={isLoadingMyAccount}>
                            <div>
                                <Table className="min-w-full bg-white">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHeaderItem textId="Nume de utilizator"/>
                                            <TableHeaderItem textId="Scor"/>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow key={myAccount.username}>
                                            <TableCell>{myAccount.username}</TableCell>
                                            <TableCell>{myAccount.totalScore}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <RarityChart content={[myAccount.commonNo, myAccount.uncommonNo, myAccount.rareNo]}/>
                            </div>
                            <div>
                                <div className="flex justify-between">
                                    <h2 className="text-xl font-bold">Specii</h2>
                                    <h2 className="text-xl font-bold ">Raritate</h2>
                                </div>
                                <div className="w-full max-h-64 border border-gray-300 p-4 overflow-y-auto mt-4">
                                    <ul className="space-y-2">
                                        {myAccount.birds.map((bird, index) => (
                                            <li key={index} className="p-2 border-b border-gray-200 last:border-b-0">
                                                <div className="flex justify-between">
                                                    <div>{bird.species}</div>
                                                    <div>{parseRarity(bird.rarity)}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Loader>
                    </div>
                    <div className="w-1/2 p-4">
                        <Loader isLoading={isLoadingComparisonAccount}>
                        {!_.isEqual(comparisonAccount, initialState) &&
                            <div >
                                <Table className="min-w-full bg-white">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHeaderItem textId="Nume de utilizator"/>
                                            <TableHeaderItem textId="Scor"/>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow key={comparisonAccount.username}>
                                            <TableCell>{comparisonAccount.username}</TableCell>
                                            <TableCell>{comparisonAccount.totalScore}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <RarityChart
                                    content={[comparisonAccount.commonNo, comparisonAccount.uncommonNo, comparisonAccount.rareNo]}/>
                                <div className="flex justify-between">
                                    <h2 className="text-xl font-bold">Specii</h2>
                                    <h2 className="text-xl font-bold ">Raritate</h2>
                                </div>
                                <div className="w-full max-h-64 border border-gray-300 p-4 overflow-y-auto mt-4">
                                    <ul className="space-y-2">
                                        {comparisonAccount.birds.map((bird, index) => (
                                            <li key={index} className="p-2 border-b border-gray-200 last:border-b-0">
                                                <div className="flex justify-between">
                                                    <div>{bird.species}</div>
                                                    <div>{parseRarity(bird.rarity)}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        }
                        </Loader>
                    </div>
                </div>
            </div>
        </div>
    );
}