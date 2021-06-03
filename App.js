import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import * as firebase from 'firebase';
import LandingPage from './Components/LandingPage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import HomePage from './Components/HomePage';
import Page from './Components/Page';
import Add from './Components/Add'

const firebaseConfig = {
  apiKey: "AIzaSyBRwWV__ynA1k6cvJUMtvWxAGkviLfDZQA",
  authDomain: "note-in-it.firebaseapp.com",
  projectId: "note-in-it",
  storageBucket: "note-in-it.appspot.com",
  messagingSenderId: "258358637754",
  appId: "1:258358637754:web:5051be5486a6455b3f7e83"
};



if (firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
    console.log("firebase initialized");
}

//Stack creation for navigation
const Stack =createStackNavigator();

export default function App() {
  NetInfoSubscription=null;
  const [connection_Status,setConnection_Status]=useState(true);
  const [render,setrender]=useState(true);
  useEffect(()=>{
    NetInfoSubscription =NetInfo.addEventListener(
      handleConnectivityChange,
    );
    // NetInfoSubscription && NetInfoSubscription()

  },[render]);

  handleConnectivityChange=(state)=>{
    setConnection_Status(state.isConnected)
  };
  //handling user state
  return (
          <NavigationContainer>
            {connection_Status?
              <Stack.Navigator initialRouteName="LandingPage">
                <Stack.Screen name="Note In It" component={LandingPage} options={{headerShown:true}} />
                <Stack.Screen name="Login" component={LoginPage} options={{headerShown:true}} />
                <Stack.Screen name="Sign Up" component={RegisterPage} options={{headerShown:true}} />
                <Stack.Screen name="Home" component={HomePage} options={{headerShown:true,headerLeft:null}} />
                <Stack.Screen name="Page" component={Page} options={{headerShown:true,headerLeft:null}} />
                <Stack.Screen name="Add" component={Add} options={{headerShown:true,headerLeft:null}} />
              </Stack.Navigator>
              :
              Alert.alert(
                  "Note Init",
                  "You are offline",
                  [
                    {
                      text:"Retry",
                      onPress:()=>setrender(!render)
                    },
                    {
                      text:"Cancel"
                    }
                  ]
              )
            }
         </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

