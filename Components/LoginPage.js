import React, {  useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View,TouchableOpacity, Alert } from 'react-native';
import * as firebase from 'firebase';
import {useNavigation } from '@react-navigation/native';
function LoginPage() {
    const [userData,setUserData]=useState({
        email:'',
        password:'',
    });
    const [errorState,setErrorState]=useState();
    const [focus,setFocus]=useState(false);
    const [blur,setblur]=useState(false);
    const navigation=useNavigation();
    navigation.setOptions({
        headerLeft:null,
        headerRight:null})

    const LoginHandler=({email,password})=>{
        setErrorState("");
        Keyboard.dismiss()
        if (email.length>0 && password.length>0){
                firebase.auth()
                        .signInWithEmailAndPassword(email,password)
                        .then(()=>{Keyboard.dismiss();Alert.alert("Note Init","Logged in successfully",[{text:"ok"}]);navigation.navigate("Home")})
                        .catch(error=>{
                            if (error.code==="auth/email-already-in-use"){
                                setErrorState("Email already in use")
                            }
                            else{
                                setErrorState("Something went wrong")
                            }
                    
                        })
        }else{
                setErrorState("All fields are mandatory") 
            }
    }
    return (
        <View style={styles.LoginPage}>
            <View style={styles.LoginView}>
                <TextInput value={userData.email} placeholder="Email" style={styles.email} onFocus={()=>setFocus(!focus)} onBlur={()=>setblur(!blur)} onChangeText={(email)=>{setUserData({...userData,email:email});setErrorState("")}}/>
                <TextInput value={userData.password} placeholder="Password" style={styles.password} secureTextEntry={true} onChangeText={(password)=>{setUserData({...userData,password:password});setErrorState("")}} />
                {errorState?
                <Text style={{color:'#007880',alignSelf:'center'}}>{errorState}</Text>
                :
                <></>
                }
                <TouchableOpacity style={styles.loginButton} onPress={()=>{
                    
                            LoginHandler(userData)
                        
                        }}>
                        <Text style={styles.logintext}>Login</Text>
                    </TouchableOpacity>
                <TouchableOpacity style={styles.signupButton} onPress={()=>{
                        navigation.navigate("Sign Up")
                        }
                    }>
                        <Text style={styles.signuptext}>Sign Up</Text>
                </TouchableOpacity> 
            </View>
            <View style={styles.init}><Text style={styles.inittext}>powered by Init</Text></View>
        </View>
    );
}

const styles=StyleSheet.create({
    init:{
        position:'absolute',
        bottom:10,
    },
    inittext:{
        color:'#007880'
    },
    signuptext:{
        textDecorationLine:'underline',
        color:'#007880',
    },
    signupButton:{
        
        width:180,
        alignItems:'center',
        height:40,
        alignSelf:'center'
    },
    LoginPage:{
        flex:1,
        justifyContent:'center',
        backgroundColor:"white",
        width:'100%',
        alignItems:'center'
    },
    LoginView:{
        padding:20,
        flex:1,
        justifyContent:'center',
        backgroundColor:"#ebf6f7",
        width:'70%',
    },
    loginButton:{
        justifyContent:'center',
        borderColor:'#64f4ff',
        borderWidth:1,
        borderRadius:25,
        backgroundColor:'#c3f5f9',
        width:130,
        alignItems:'center',
        height:30,
        marginBottom:5,
        marginTop:8,
        shadowColor:'#24c0ca',
        shadowRadius:10,
        shadowOffset:{
            width:0,
            height:4
        },
        shadowOpacity:0.41,
        shadowRadius: 4.65,
        elevation:6,
        alignSelf:'center'
    },
    logintext:{
        fontSize:19,
        fontFamily:'serif',
        color:'#00292c'
        
    },
    email:{
        height:45,
        marginBottom:4,
        fontSize:18
        // borderColor: focus && '#c3f5f9',
        // borderWidth: focus && 2

    },
    password:{
        height:45,
        fontSize:18
    }
})

export default LoginPage;