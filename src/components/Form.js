import React,{useRef,useState} from 'react'
import './Forms.css'

import LocationOnIcon from '@mui/icons-material/LocationOn';
import {Autocomplete,DirectionsRenderer,useJsApiLoader,Marker, GoogleMap} from '@react-google-maps/api'

const center = {lat: 48.8584, lng: 2.2945}

const Form = () => {
    const {isLoaded} = useJsApiLoader({
    googleMapsApiKey : process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
    })

    // const [map,setMap] = useState(null)
    const [directionsResp, setDirectionsResp] = useState(null)
    const [distance,setDistance] = useState('')

    const originRef = useRef()
    const destinationRef = useRef()

    if(!isLoaded){
        return <h1>Hi</h1>
    }
    
async function calculateRoute(e){
        e.preventDefault()

        if(originRef.current.value === '' || destinationRef.current.value === ''){
            return
        }
        const directionsService = new window.google.maps.DirectionsService()
        const result = await directionsService.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            travelMode: window.google.maps.TravelMode.DRIVING
        })
        setDirectionsResp(result)
        setDistance(result.routes[0].legs[0].distance.text)
    }

return (
    <div className='forms row'>
        <p style={{color: 'darkblue', textAlign: 'center'}}>Let's calculate <span style={{fontWeight: 'bold', color: 'darkblue'}}>distance</span> from Google maps</p>
        <form className='col-md-6'>
            <div className="div1">
                <div className="form-group">
                    <label htmlFor="origin">Origin</label>
                    <div className="form-input">
                        <span className='icon'><LocationOnIcon style={{color: 'red'}}/></span>
                        <Autocomplete>
                        <input type="text" className="form-control" id='origin' placeholder="Enter Origin" ref={originRef}/>
                        </Autocomplete>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="destination">Destination</label>
                    <div className="form-input">
                        <span className='icon'><LocationOnIcon style={{color: 'red'}}/></span>
                        <Autocomplete>
                        <input type="text" className="form-control" id="destination" placeholder="Enter Destination" ref={destinationRef}/>
                        </Autocomplete>
                    </div>
                </div>
            </div>
            <div className="div2">
                <button type="submit" className="btn btn-primary" onClick={calculateRoute}>Calculate</button>
            </div>
        </form>

        <div className='col-md-6 map'>
            <div className='map-box'>
            <GoogleMap center={center} zoom={15} mapContainerStyle={{width: '100%', height: '100%'}}
            options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                keyboardShortcuts: false,
            }} >

                <Marker position={center}/>
                {directionsResp && (
                <DirectionsRenderer directions={directionsResp}/>)}
            </GoogleMap>
            </div>
        </div> 

        <div className='dist'>
        <div  className="display">
            <p><span className='text'>Distance</span><span className='distance'>{distance}</span></p>
        </div>
        {directionsResp && (
                <small className="form-text text-muted">The distance between <span style={{fontWeight: 'bold'}}>{originRef.current.value}</span> and <span style={{fontWeight: 'bold'}}>{destinationRef.current.value}</span> is <span style={{fontWeight: 'bold'}}>{distance}s.</span></small>)}
        </div>
    </div>
)
}

export default Form