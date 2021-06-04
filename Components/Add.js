import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useState } from 'react';
import { Text, TextInput, View ,StyleSheet,TouchableOpacity, ScrollView, Keyboard,Alert} from 'react-native';
import * as firebase from 'firebase';
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
function Add() {
    const route=useRoute();
    const {uid,rerender,setRerender,fetchedData} = route.params;
    const [error,setError]=useState();
    const [newObject,setNewObject]=useState({
        title:'',
        body:''
    });
    const navigation=useNavigation();
    navigation.setOptions({
        headerRight:()=>
            <View style={styles.navoptions}>
                <TouchableOpacity style={styles.navoption} onPress={()=>navigation.goBack()}>
                    <AntDesign name="back" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navoption} onPress={()=>{
                    if (newObject.title.length===0){
                            setError("Title is mandatory")
                    }
                    else if(newObject.body.length===0){
                        setError("Body is mandatory")
                    }
                    else{
                        Keyboard.dismiss();
                        DataSubmitionHandler()
                    }
                    }}>
                    <Entypo name="add-to-list" size={24} color="black" />
                </TouchableOpacity>
            </View>
        
        
      });
    const DataSubmitionHandler=()=>{
            setError("");
            try{
                firebase.firestore()
                        .collection('users')
                        .doc(uid)
                        .update(
                            {datas:[...fetchedData,newObject]}
                            )
                        .then(()=>{setRerender(!rerender);
                            navigation.goBack();
                            Alert.alert("Note Init",
                            "Added successfully",
                            [
                                {
                                    text: "Ok"
                                }
                            ])
                        })
                        .catch((e)=>{setError("Something went wrong")});
                }catch(error){
                    setError("Something went wrong");
                }
    };  
    return (
        <View style={styles.container}> 
        <Text style={styles.error}>{error}</Text>
            <ScrollView style={styles.containersub}> 
                <View>
                    {newObject.title.length!==0 &&
                        <Text>Title</Text>
                    }
                    <TextInput placeholder="Title" style={styles.titletext} multiline={true} onChangeText={text=>{setError("");setNewObject({...newObject,title:text})}}></TextInput>
                    {newObject.body.length!==0 &&
                        <Text>Body</Text>
                    }
                    <TextInput placeholder="Body" style={styles.containertext} multiline={true} onChangeText={text=>{setError("");setNewObject({...newObject,body:text})}}></TextInput>
                </View>
            </ScrollView>
        </View>
    );
}

export default Add;

const styles=StyleSheet.create({
    error:{
        margin:10,
        color:'#007880'
    },
    navoptions:{
        flexDirection:'row'
    },
    navoption:{
        marginRight:30,
        backgroundColor:'white'
    },
    container:{
        flex:1,
        backgroundColor:"#ebf6f7",
        padding:30,
        flexDirection:'column'
    },
    containersub:{
        elevation:9,
        backgroundColor:'#16d7e7',
        borderRadius:20,
        padding:20,
        minHeight:'100%'
    },
    containertext:{
        color:'#ebf6f7',
        fontSize:20,
        width:'100%',
        minHeight:50,
        paddingTop:10
    },
    titletext:{
        color:'#ebf6f7',
        fontSize:20,
        width:'100%',
        marginBottom:20,
        minHeight:50,
        paddingBottom:20,
        borderBottomColor:'black',
        borderBottomWidth:2,
        
        
    }

})