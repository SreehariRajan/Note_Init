import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useState} from 'react';
import {Text, TextInput, View ,StyleSheet,TouchableOpacity, ScrollView, Alert,Keyboard,Share} from 'react-native';
import * as firebase from 'firebase';
import { AntDesign,Entypo } from '@expo/vector-icons';
function Page() {
    const [error,setError]=useState();
    const navigation=useNavigation();
    function Alertdelete(){
        setError("");
        Alert.alert(
            "Note Init",
            "Are you sure ?",
            [
                {
                    text:"yes",
                    onPress:()=>DeleteHandler()
                },
                {
                    text:'no'
                }
            ]
        )
    }
    function Alertupdate(){
        setError("");
        Alert.alert(
            "Note Init",
            "Are you sure ?",
            [
                {
                    text:"yes",
                    onPress:()=>UpdateHandler()
                },
                {
                    text:'no'
                }
            ]
        )
    }
    navigation.setOptions({
        headerRight:()=>
            <View style={styles.navoptions}>
                <TouchableOpacity style={styles.navoption} onPress={()=>navigation.goBack()}>
                    <AntDesign name="back" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navoption} onPress={()=>Alertdelete()}>
                    <AntDesign name="delete" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navoption} onPress={()=>ShareOption()}>
                    <Entypo name="share" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navoption} onPress={()=>{
                if (textupdate.title.length===0){
                        setError("Title is mandatory")
                }
                else if(textupdate.body.length===0){
                    setError("Body is mandatory")
                }
                else{
                    Keyboard.dismiss();
                    Alertupdate()
                }
                }}>
                    <AntDesign name="edit" size={24} color="black" />
                </TouchableOpacity>
            </View>
      });
    const route=useRoute();
    const {key,uid,value,rerender,setRerender,fetchedData} = route.params;
    const [fetchedDatas,setfetchedDatas]=useState(fetchedData);
    const [textupdate,settextupdate]=useState(value);
    
    const ShareOption = async () => {
        setError("");
        try{
            const result = await Share.share({
                message:
                    `Title: ${textupdate.title} \n \n ${textupdate.body}`,

            });
        }
        catch(error){
            alert("Something went wrong \n Try again Later");
        }
    };
    function DeleteHandler(){
            setError("");
            Keyboard.dismiss();
            let data=fetchedDatas;
            data.splice(key,1);
            setfetchedDatas(data);
            try{
            firebase.firestore()    
                    .collection('users')
                    .doc(uid)
                    .update({
                        datas:fetchedDatas
                    })
            setRerender(!rerender);
            navigation.goBack();
            }catch(error){
                alert("Something went wrong \n Try again Later");
            };
    };
    function UpdateHandler(){
            setError("");
            let data=fetchedDatas;
            data.splice(key,1);
            data.splice(key,0,textupdate);
            setfetchedDatas(data);
            try{
            firebase.firestore()
                    .collection('users')
                    .doc(uid)
                    .update({
                        datas:fetchedDatas
                    })
            setRerender(!rerender);
            navigation.goBack();
            }catch(error){
                alert("Something went wrong \n Try again Later");
            }
    };
    return (
        <View style={styles.container}> 
            <Text style={styles.error}>{error}</Text>
            <ScrollView style={styles.containersub}> 
                <View>
                    {textupdate.title.length!==0 &&
                        <Text>Title</Text>
                    }
                    <TextInput style={styles.titletext} multiline={true} onChangeText={text=>settextupdate({...textupdate,title:text})}>{textupdate.title}</TextInput>
                    {textupdate.body.length!==0 &&
                        <Text>Body</Text>
                    }
                    <TextInput style={styles.containertext} multiline={true} onChangeText={text=>settextupdate({...textupdate,body:text})}>{textupdate.body}</TextInput>
                </View>
            </ScrollView>
        </View>
    );
}

export default Page;

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
        padding:30
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