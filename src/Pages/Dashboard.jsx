import React from 'react'
import Admin from '../Component/Table/Table';
import Navbar from '../Component/NavBar/Navbar'
import MapView from '../Component/BasestationMap/Mapview'
import User from '../Component/User/User';



export default function Dashboard() {
  return (
    <div style={{marginTop:'150px',minWidth:'100%'}} >
        <Navbar/>
        <h3 style={{textAlign:'center',marginBottom:'20px',color:'darkblue',textTransform:'uppercase'}}>Base Station</h3>
        <Admin/>
        <MapView/>
        <div style={{marginTop:'50px'}}></div>
        <User/>
        <div style={{marginTop:'50px'}}></div>
    </div>
  )
}
