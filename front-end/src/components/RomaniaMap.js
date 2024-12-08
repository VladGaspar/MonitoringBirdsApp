import React, {useCallback, useMemo, useState} from 'react';
import {MapContainer, Marker, TileLayer} from 'react-leaflet';
import Leaflet from 'leaflet';
import {Button} from "../button/Button";
import {FaSquare} from "react-icons/fa";

const mapStyle = {
    height: '650px', // set the height you want
    width: '900px', // set the width you want
    margin: 'auto',
    zIndex: 0// centers the map on the screen with 50px top and bottom margin
};


const markerHtmlStylesRed = `
  background-color: ${'#ff7e32'};
  width: 2.5rem;
  height: 2.5rem;
  display: block;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`

const markerHtmlStylesBlue = `
  background-color: ${'#02b83c'};
  width: 2rem;
  height: 2rem;
  display: block;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`

const orangeIcon = Leaflet.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStylesRed}" />`
})

const greenIcon = Leaflet.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStylesBlue}" />`
})

const center = [45.9432, 24.9668];
const zoom = 7;

function DisplayPosition({map, year, comparisonYear}) {

    const onClick = useCallback(() => {
        map.setView(center, zoom)
    }, [map])


    return (
        <div className="flex my-4 items-center justify-center">
            <div>
                <span className="text-3xl font-bold mr-4">Harta</span>
                <Button onClick={onClick}>Reset</Button>
            </div>
            <div className="flex-1 text-center flex items-center justify-center mr-12">
                <div>
                    <p>Legenda: </p>
                    <div className="inline-flex items-center">
                        <FaSquare color={"#ff7e32"}/>
                        <p className="ml-1">{year ?? 2024}</p>
                    </div>
                    {comparisonYear && (
                        <div className="inline-flex items-center ml-4">
                            <FaSquare color={"#02b83c"}/>
                            <p className="ml-1">{comparisonYear}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}


const RomaniaMap = ({orangeCoordinates, greenCoordinates, year, comparisonYear}) => {
    const [map, setMap] = useState(null)

    const displayMap = useMemo(
        () => (
            <div style={mapStyle}>
                <MapContainer center={center} zoom={zoom} style={{height: '100%', width: '100%'}} ref={setMap}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {orangeCoordinates.map((coord, index) => (
                        <Marker key={index} position={[coord.latitude, coord.longitude]} icon={orangeIcon}/>

                    ))}
                    {greenCoordinates.map((coord, index) => (
                        <Marker key={index} position={[coord.latitude, coord.longitude]} icon={greenIcon}/>
                    ))}
                </MapContainer>
            </div>

        ),
        [orangeCoordinates, greenCoordinates],
    )
    return (
        <div>
            {map ? <DisplayPosition map={map} year={year} comparisonYear={comparisonYear}/> : null}
            {displayMap}
        </div>
    )
};

export default RomaniaMap;
