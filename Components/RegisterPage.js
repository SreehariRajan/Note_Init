import React, { useState,useContext } from 'react';
import { StyleSheet, Text, TextInput, View,TouchableOpacity,Alert, Keyboard} from 'react-native';
import * as firebase from 'firebase';
import {useNavigation} from '@react-navigation/native'; 
function RegisterPage() {
    const [password,setpassword]=useState('');
    const [passwordCheck,setpasswordCheck]=useState('');
    const [errorDisplaState,seterrorDisplayState]=useState('');
    const [userDetails,setuserDetails]=useState({
        name:'',
        email:'',
    });

    const navigation=useNavigation();
    navigation.setOptions({
        headerLeft:null,
        headerRight:null})
    const submitHandler=()=>{
        seterrorDisplayState("");
        Keyboard.dismiss();
        if (password.length>0 && passwordCheck.length>0 && userDetails.name.length>0 && userDetails.email.length>0){
            if (password===passwordCheck){
                    firebase.auth()
                    .createUserWithEmailAndPassword(userDetails.email,password)
                    .then(()=>{
                        const currentuser=firebase.auth().currentUser;
                        const uid=currentuser.uid;
                        firebase.firestore()
                        .collection('users')
                        .doc(uid)
                        .set(
                            {name:userDetails.name,
                            datas:[]}
                            )
                        .then(()=>{
                            Keyboard.dismiss();
                            Alert.alert("Note Init","Successfully created account",[{text:"ok"}])
                            navigation.navigate("Home")})
                    })
                    .catch(error =>{
                        if (error.code==="auth/email-already-in-use"){
                            seterrorDisplayState("Email already in use")
                        }
                        else{
                            seterrorDisplayState("Something went wrong")
                        }
                
                    });
        }else{
            seterrorDisplayState("Those passwords didnt match. Try again");
        }
        }else{
            seterrorDisplayState("All fields are mandatory")
        }
        };
    return (
        <View style={styles.main}>
            <View style={styles.sub}>
                <TextInput value={userDetails.name} style={styles.name} placeholder="Name" onChangeText={(name)=>{seterrorDisplayState("");setuserDetails({...userDetails,name:name})}}/>
                <TextInput value={userDetails.email} style={styles.email} placeholder="Email" onChangeText={(email)=>{seterrorDisplayState("");setuserDetails({...userDetails,email:email})}}/>
                <TextInput value={password} style={styles.pass} secureTextEntry={true} placeholder="Password" onChangeText={(password)=>{setpassword(password);seterrorDisplayState("")}}/>
                <TextInput value={passwordCheck} style={styles.confirm} secureTextEntry={true} placeholder="Confirm password" onChangeText={(password)=>{setpasswordCheck(password);seterrorDisplayState("")}}/>
                <Text style={styles.error}>{errorDisplaState}</Text>
                <TouchableOpacity style={styles.signupButton} onPress={()=>{
                            submitHandler(userDetails,passwordCheck,password)
                        }}>
                        <Text style={styles.signuptext}>Create account</Text>
                    </TouchableOpacity>
                <Text style={styles.Signintext} onPress={()=>navigation.navigate("Login")}>Sign in instead</Text> 
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
    name:{
        fontSize:18,
        marginBottom:10,
    },
    email:{
        fontSize:18,
        marginBottom:10,
    },
    pass:{
        fontSize:18,
        marginBottom:10,
    },
    confirm:{
        fontSize:18,
        marginBottom:10,
    },
    error:{
        alignSelf:'center',
        color:'#007880',
    },
    main:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    },
    sub:{
        flex:1,
        justifyContent:'center',
        backgroundColor:"#ebf6f7",
        padding:20,
        width:'70%',
    },
    Signintext:{
        textDecorationLine:'underline',
        color:'#007880',
        alignSelf:'center'
    },
    signupButton:{
        justifyContent:'center',
        borderColor:'#64f4ff',
        borderWidth:1,
        borderRadius:25,
        backgroundColor:'#c3f5f9',
        width:140,
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
    signuptext:{
        fontSize:15,
        fontFamily:'serif',
        color:'#00292c'
        
    },
})

export default RegisterPage;