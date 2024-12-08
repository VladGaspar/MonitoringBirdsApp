import React, {useEffect, useRef, useState} from 'react';
import Carousel from 'react-responsive-carousel/lib/js/components/Carousel/index';
import {MapContainer, Marker, TileLayer} from 'react-leaflet';
import Leaflet from 'leaflet';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // import styles
import './style/carouselStyle.css';

const markerHtmlStylesRed = `
  background-color: ${'#ff7e32'};
  width: 2.5rem;
  height: 2.5rem;
  display: block;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

const markerHtmlStylesBlue = `
  background-color: ${'#02b83c'};
  width: 2rem;
  height: 2rem;
  display: block;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`

const blueIcon = Leaflet.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStylesBlue}" />`
})

const redIcon = Leaflet.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStylesRed}" />`
});

const mapStyle = {
    height: '650px',
    width: '900px',
    margin: 'auto',
    zIndex: 0
};

function getMonthName(index) {
    switch (index) {
        case 0:
            return "Ianuarie";
        case 1:
            return "Februarie";
        case 2:
            return "Martie";
        case 3:
            return "Aprilie";
        case 4:
            return "Mai";
        case 5:
            return "Iunie";
        case 6:
            return "Iulie";
        case 7:
            return "August";
        case 8:
            return "Septembrie";
        case 9:
            return "Octombrie";
        case 10:
            return "Noiembrie";
        case 11:
            return "Decembrie";
        default:
            return "Index invalid. Te rog să introduci un număr între 0 și 11.";
    }
}

const MapSlide = ({orangeCoordinates, greenCoordinates}) => {
    const mapRef = useRef();

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.invalidateSize();
        }
    }, []);

    return (
        <div style={mapStyle}>
            <MapContainer
                center={[45.9432, 24.9668]}
                zoom={7}
                style={{height: '100%', width: '100%'}}
                doubleClickZoom={false}
                closePopupOnClick={false}
                dragging={false}
                zoomSnap={false}
                zoomDelta={false}
                trackResize={false}
                touchZoom={false}
                scrollWheelZoom={false}
                whenCreated={mapInstance => {
                    mapRef.current = mapInstance;
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {orangeCoordinates.map((coord, index) => (
                    <Marker key={index} position={[coord.latitude, coord.longitude]} icon={redIcon}/>

                ))}
                {greenCoordinates.map((coord, index) => (
                    <Marker key={index} position={[coord.latitude, coord.longitude]} icon={blueIcon}/>
                ))}
            </MapContainer>
        </div>
    );
};

const getMonthFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.getMonth();
};

const calculateData = (slides, year, comparisonYear) => {
    const slidesData = Array.from({length: 12}, () => ({orangeCoordinates: [],greenCoordinates: []}));
    slides.forEach(data => {
        const date = new Date(data.date)
        if (year === date.getFullYear()) {
            const monthIndex = getMonthFromDate(data.date);
            slidesData[monthIndex].orangeCoordinates.push({latitude: data.latitude, longitude: data.longitude});
        }
        if (comparisonYear === date.getFullYear()) {
            const monthIndex = getMonthFromDate(data.date);
            slidesData[monthIndex].greenCoordinates.push({latitude: data.latitude, longitude: data.longitude});
        }
    });
    return slidesData;
};

const RomaniaMapSlideShow = ({slides, year, comparisonYear}) => {
    const [slidesData, setSlidesData] = useState(Array.from({length: 12}, () => ({orangeCoordinates: [],greenCoordinates: []})));

    useEffect(() => {
        const updatedSlidesData = calculateData(slides, year,comparisonYear);
        setSlidesData(updatedSlidesData);
    }, [slidesData, slides, year,comparisonYear]);

    return (
        <Carousel
            dynamicHeight={false}
            swipeable={false}
            animationHandler="fade"
            showArrows={false}
            stopOnHover={true}
            showThumbs={false}
            className="custom-carousel"
            autoPlay={true}
            interval={2000}
            infiniteLoop={true}
        >
            {slidesData.map((slide, index) => (
                <div key={index}>
                    <MapSlide orangeCoordinates={slide.orangeCoordinates} greenCoordinates={slide.greenCoordinates}/>
                    <p className="font-semibold mt-8">{getMonthName(index)}</p>
                </div>
            ))}
        </Carousel>
    );
};

export default RomaniaMapSlideShow;
