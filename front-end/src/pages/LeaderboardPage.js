import {userApi} from "../api/userApi";
import {useEffect, useState} from "react";
import useAuth from "../hooks/useAuth";
import {Loader} from "../components/Loader";

export default function LeaderboardPage() {
    const [leaderBoard, setLeaderBoard] = useState([]);
    const {getUsername} = useAuth();
    const [isLoadingLeaderBoard, setIsLoadingLeaderBoard] = useState()
    const [error, setError] = useState();
    // useEffect(() => {
    //     const fetchLeaderboard = async () => {
    //         try {
    //             const res = await userApi.getLeaderboard();
    //             setLeaderBoard(res.data);
    //         } catch (error) {
    //             console.error('Failed to fetch leaderboard:', error);
    //         }
    //     };
    //
    //     fetchLeaderboard();
    // }, []);


    const fetchLeaderboard = () => {
        setIsLoadingLeaderBoard(true);
        userApi.getLeaderboard()
            .then(res => setLeaderBoard(res.data))
            .catch(() => 'Failed to fetch Leaderboard:', error)
            .finally(() => setIsLoadingLeaderBoard(false))
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    return (
        <div className='w-screen flex flex-col items-center bg-gray-100 p-4' style={{minHeight: 'calc(100vh - 64px)'}}>
            <h2 className='text-3xl font-bold text-center  mb-8'>Clasament Top 15</h2>
            <div className="w-full max-w-2xl shadow-lg rounded-lg flex flex-col overflow-hidden flex-grow">
                <div className="bg-gray-300 text-white">
                    <div className="flex px-6 py-4">
                        <div className="flex-1">
                            <span className="font-bold text-lg">Nume de utilizator</span>
                        </div>
                        <div className="flex-1 text-right mx-1">
                            <span className="font-bold text-lg">Scor</span>
                        </div>
                        <div>
                            <span className="font-bold text-lg">Pozitie</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white flex-grow overflow-y-auto">
                    <Loader isLoading={isLoadingLeaderBoard} size={100}>
                    {leaderBoard.map((user, index) => (
                        <div
                            key={user.username}
                            className={`flex items-center px-6 py-4 border-b-2 ${getUsername() === user.username ? 'bg-cyan-600 text-white' : 'bg-white'}`}
                        >
                            <div className="flex-1">
                                <span
                                    className={`font-bold text-lg ${getUsername() === user.username ? 'text-white' : 'text-gray-800'}`}>{user.username}</span>
                            </div>
                            <div className="flex-1 text-right mr-3">
                                <span
                                    className={`font-bold text-lg ${getUsername() === user.username ? 'text-white' : 'text-gray-800'}`}>{user.score}</span>
                            </div>
                            <div className="w-12 flex justify-center">
                                <span
                                    className={`rounded-full text-xs font-semibold px-3 py-1 ${index === 0 ? 'bg-orange-400' : 'bg-gray-300'}`}>
                                    {index + 1}
                                </span>
                            </div>
                        </div>
                    ))}
                    </Loader>
                </div>
            </div>
        </div>
    );
}
