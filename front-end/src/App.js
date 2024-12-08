import React from 'react';
import 'leaflet/dist/leaflet.css';
import {BrowserRouter} from "react-router-dom";
import {AppRoutes} from "./routes/Routes";


const App = () => {
    // return <BirdListingPage/>
    return <BrowserRouter>
        <AppRoutes/>
    </BrowserRouter>
};

export default App;
