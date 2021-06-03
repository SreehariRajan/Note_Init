import React,{useState,useEffect} from 'react';
import { StyleSheet, View ,ActivityIndicator} from 'react-native';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import * as firebase from 'firebase';

export default function LandingPage() {
    const [user, setUser] = useState();
    const [loading,setloading]=useState(true);
    function onAuthStateChanged(user) {
        setUser(user);
        setloading(false);
    };
    useEffect(() => {
                const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
                return subscriber;   
    }, []);

    return (
        <View style={styles.LandingPage}>
                {!loading? 
                (!user?(
                <>
                <LoginPage />
                {/* <View style={styles.init}><Text style={styles.inittext}>powered by Init</Text></View> */}
                </>)
                :
                (<HomePage/>)):<ActivityIndicator style={styles.spinner} size="large" color="#16d7e7"/>}
        </View>
    );
}

const styles = StyleSheet.create({
    spinner:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    LandingPage:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    text:{
        color:'blue'
    },
    init:{
        position:'absolute',
        bottom:10,
    },
    inittext:{
        color:'#007880'
    }
})