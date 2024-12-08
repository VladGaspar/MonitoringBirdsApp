import {useDispatch} from 'react-redux'
import React, {useState} from 'react'

import BirdFilter from "../components/BirdFilter";
import useLoadBirds from "../hooks/useLoadBirds";
import {birdAction} from "../store/birdSlice";
import {Loader} from "../components/Loader";
import ObservationChart from "../components/ObservationChart";
import RomaniaMap from "../components/RomaniaMap";
import {Button} from "../button/Button";
import RomaniaMapSlideshow from "../components/RomaniaMapSlideShow";

export default function BirdListingPage() {
    const dispatch = useDispatch()
    const {birdSlice, isLoading} = useLoadBirds();
    const [periodStep, setPeriodStep] = useState('1_WEEK');
    const [activeTab, setActiveTab] = useState('map');


    const handleSubmitFilter = (e) => {
        if (e.periodType === 'YEAR') {
            e = {...e, comparisonYear: undefined}
        }
        dispatch(birdAction.setFilter(e))
    }

    const handleResetFilter = () => {
        dispatch(birdAction.setFilter({}))
    }

    const getYearFromDate = (dateString) => {
        return new Date(dateString).getFullYear();
    };

    const orangeCoordinates = birdSlice.filter.year
        ? birdSlice.data.filter(item => getYearFromDate(item.date) === birdSlice.filter.year)
        : birdSlice.data;

    const greenCoordinates = birdSlice.filter.comparisonYear
        ? birdSlice.data.filter(item => getYearFromDate(item.date) === birdSlice.filter.comparisonYear)
        : [];

    return (
        <div className="flex w-full" style={{minHeight: 'calc(100vh - 64px)'}}>

            <div className="w-64 px-4 pt-8 bg-gray-100 shadow-lg">
                <h1 className="text-4xl font-bold text-black mb-4">Filtrare</h1>
                <BirdFilter onSubmit={handleSubmitFilter} onReset={handleResetFilter}/>
            </div>
            <div className="flex-grow px-4 py-8 flex flex-col bg-gray-100">
                <div className="flex space-x-4 mb-4">
                    <Button
                        className={`p-2 rounded ${activeTab === 'map' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600'}`}
                        onClick={() => setActiveTab('map')}>
                        {"Hartă"}
                    </Button>
                    <Button
                        className={`p-2 rounded ${activeTab === 'chart' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600'}`}
                        onClick={() => setActiveTab('chart')}>
                        {"Grafic"}
                    </Button>
                    <Button
                        className={`p-2 rounded ${activeTab === 'mapChart' ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600'}`}
                        onClick={() => setActiveTab('mapChart')}>
                        {"Observații pe luni"}
                    </Button>
                </div>
                <div className="bg-white rounded-lg flex-grow flex flex-col shadow p-4">
                    <Loader isLoading={isLoading} size={150}>
                        {activeTab === 'map' && birdSlice.data &&
                            <div className="flex-grow overflow-hidden">
                                <RomaniaMap orangeCoordinates={orangeCoordinates} greenCoordinates={greenCoordinates}
                                            year={birdSlice.filter.year}
                                            comparisonYear={birdSlice.filter.comparisonYear}/>
                            </div>
                        }
                        {activeTab === 'chart' && birdSlice.data &&
                            <div className="flex-grow flex flex-col">
                                <div className="my-4">
                                    <span className="text-3xl font-bold text-black">Grafic</span>
                                </div>
                                <div className="w-full flex-grow flex flex-col">
                                    <select className="p-2 rounded border-2 mb-4"
                                            value={periodStep} onChange={(e) => setPeriodStep(e.target.value)}>
                                        <option value="3_DAYS">3 Zile</option>
                                        <option value="1_WEEK">O Săptămână</option>
                                        <option value="2_WEEKS">2 Saptamani</option>
                                        <option value="1_MONTH">1 Luna</option>
                                    </select>
                                    <div className="flex-grow overflow-hidden"
                                         style={{maxHeight: 'calc(100vh - 300px)'}}>
                                        <ObservationChart observations={birdSlice.data}
                                                          period={birdSlice.filter.periodType}
                                                          stepLabel={periodStep}
                                                          year={birdSlice.filter.year ?? 2024}
                                                          comparisonYear={birdSlice.filter.comparisonYear}/>
                                    </div>
                                </div>
                            </div>
                        }
                        {activeTab === 'mapChart' && birdSlice.data &&
                            <div className=" overflow-hidden">
                                <RomaniaMapSlideshow slides={birdSlice.data} year={birdSlice.filter.year ?? 2024} comparisonYear={birdSlice.filter.comparisonYear ?? undefined}/>
                            </div>
                        }
                    </Loader>
                </div>
            </div>
        </div>
    );
}
