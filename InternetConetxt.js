import React,{useState, useEffect} from 'react';
import { createContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
export const ConnectionStateContext=createContext();

export const ConnectionStateProvider=(props)=>{
    const [Internetrender,setinternetrender]=useState(true);
    const [netConnection,setnetConnection]=useState(false);
    NetInfo.fetch()
        .then(state=>{
            setnetConnection(state.isConnected)
        })

    
    // console.log("context...............",netConnection);
    return (
        <ConnectionStateContext.Provider value={[Internetrender,setinternetrender,netConnection,setnetConnection]}>
            {props.children}
        </ConnectionStateContext.Provider>
    )
}