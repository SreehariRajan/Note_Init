import { useNavigation} from '@react-navigation/core';
import React, { useState,useEffect,useContext} from 'react';
import { Text,TouchableOpacity,View, StyleSheet,ScrollView,ActivityIndicator,Alert, TextInput, RefreshControl, ToastAndroid } from 'react-native';
import * as firebase from 'firebase';
import { setStatusBarHidden } from 'expo-status-bar';
import { SimpleLineIcons } from '@expo/vector-icons'; 
import { EvilIcons } from '@expo/vector-icons';
require('firebase/firestore');
function HomePage() {
    const [refreshing,setrefreshing]=useState(false);
    const navigation=useNavigation();
    const [error,seterror]=useState("");
    const [loading,setloading]=useState(true);
    const [rerender,setRerender]=useState(false);
    const [input,setinput]=useState("");
    const user=firebase.auth().currentUser;
    const uid=user.uid;
    const [fetchedData,setfetchedData]=useState([]);
    const [name,setName]=useState();
    navigation.setOptions({
        headerRight: () =>
        <View style={styles.navoptions}>
                {name && 
                <View style={styles.userdiv}>
                    <EvilIcons name="user" size={40} color="black" /> 
                    <Text style={styles.user}>{name}</Text>
                </View>
                }
                <TouchableOpacity style={styles.navoption} onPress={()=>AlertLogout()}>
                    <SimpleLineIcons name="logout" size={24} color="black" />
                </TouchableOpacity>
            </View>
        
        ,
      });

    function AlertLogout(){
        seterror("");
        Alert.alert(
            "Not Init",
            "Are you sure ?",
            [
                {
                    text:'Yes',
                    onPress:()=>SignOutHandler()
                },
                {
                    text:'No'
                }
            ]
        )
    };

    function SignOutHandler(){
            seterror("");
            try{
                firebase.auth()
                        .signOut()
                        .then(()=>{navigation.navigate("Login")})
            }catch (error){
            seterror("Something went wrong")
            }
    };
    const RefreshHandler=()=>{
        setrefreshing(true);
        DataFetchHandler();
        setrefreshing(false);
        if (error===""){
            seterror("");
            ToastAndroid.show('You are upto date ',ToastAndroid.SHORT);
        }
        else if(error==="Some thing went wrong"){
            ToastAndroid.show('You are offline ',ToastAndroid.SHORT);
            }
    }
    const DataFetchHandler=()=>{
        try{
        firebase.firestore()
                .collection('users')
                .doc(uid)
                .get()
                .then((result)=>{
                    if (result.exists){
                        setName(result.data().name);
                        seterror("");
                        setfetchedData(result.data().datas);
                        
                      }
                })
                .catch((e)=>{
                    seterror("Some thing went wrong");
                }) 
        setloading(false);
            }catch(error){
                seterror("Something went wrong")
            }    
    };
    useEffect(()=>{  
                seterror("");
                DataFetchHandler();
           
    },[rerender]);
    const filtering = fetchedData.filter(item =>{
         return input!==""?item.title.toLowerCase().includes(input.toLowerCase()):item;
     });
    return (
        <>
        {!loading?
        <View style={styles.div}>
            {(error.length>0) &&
            <Text style={styles.error}>{error}</Text>
            }
            <TextInput style={styles.input} value={input} placeholder="Search" onChangeText={(text)=>setinput(text)}/> 
            <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>RefreshHandler()} colors={["#16d7e7"]} />}>
                {(fetchedData.length>0) &&
                    <Text style={styles.initnotes}>In_It Notes</Text>
                }
                {(fetchedData.length>0)?
               Object.entries(filtering).map(([key,val])=>{
                    return (<TouchableOpacity style={styles.datacontainer} key={key} onPress={()=>{navigation.navigate('Page',{
                            key:key,
                            uid:uid,
                            value:val,
                            rerender:rerender,
                            setRerender:setRerender,
                            fetchedData:fetchedData,
                            DataFetchHandler:DataFetchHandler
                            })}}>
                                <Text style={styles.textentry} numberOfLines={1}>{val.title}</Text>
                            </TouchableOpacity>)
                }):
                ((fetchedData.length===0) &&
                <Text style={styles.firstnote}>Add first Note</Text>
                )   
                }
                
            </ScrollView>
            <View style={styles.addcontainer}>
                <TouchableOpacity style={styles.add} onPress={()=>{
                        navigation.navigate('Add',{
                            uid:uid,
                            rerender:rerender,
                            setRerender:setRerender,
                            fetchedData:fetchedData,
                            })
                        }}>
                        <Text style={styles.addtext}>+</Text>
                </TouchableOpacity>
            </View>
            
        </View>
        :<ActivityIndicator style={styles.spinner} size="large" color="#16d7e7"/>
        }
        </>
    );
}

export default HomePage;

const styles=StyleSheet.create({
    input:{
        width:'90%',
        height:45,
        alignSelf:'center',
        fontSize:18,
        borderColor:'#16d7e7',
        borderWidth:2,
        borderRadius:30,
        paddingLeft:20,
        paddingRight:20,
        marginTop:15,
        marginBottom:20

    },
    error:{
        margin:10,
        color:'#007880'
    },
    spinner:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    addcontainer:{
         width:'100%',
         elevation:8,
         height:75,
         backgroundColor:'white',
         shadowColor:'white'
    },
    firstnote:{
        marginTop:30,
        alignSelf:'center',
        fontSize:20
    },
    initnotes:{
        fontSize:20,
        marginLeft:23,
        marginTop:20,
        color:'#16d7e7',
        marginBottom:10
    },
    textentry:{
        fontSize:18,
        color:'#ebf6f7'
    },
    userdiv:{
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
        paddingRight:30
    },
    container:{
        marginTop:0,
        marginBottom:0
    },
    user:{
        fontSize:18,
        color:'#16d7e7',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    textinput:{
        fontSize:18,
        color:'#ebf6f7',
        width:'80%',
        backgroundColor:'#16d7e7',
        height:50,
        borderRadius:30,
        paddingLeft:20,
        paddingRight:20
    },
    div:{
        flex:1,
        backgroundColor:'white',
        width:'100%'
    },
    datacontainer:{
        backgroundColor:"#16d7e7",
        marginLeft:20,
        marginRight:15,
        marginBottom:10,
        padding:10,
        borderRadius:5,
        minHeight:50,
        borderColor:'#16d7e7',
        borderWidth:1,
        shadowColor:'#24c0ca',
        shadowRadius:10,
        shadowOffset:{
            width:0,
            height:4
        },
        shadowOpacity:0.41,
        shadowRadius: 4.65,
        elevation:5,
    },
    add:{
        backgroundColor:'#16d7e7',
        borderRadius:60,
        width:50,
        height:50,
        position:'absolute',
        bottom:15,
        right:10,
        shadowColor:'#24c0ca',
        shadowRadius:10,
        shadowOffset:{
            width:0,
            height:4
        },
        shadowOpacity:0.41,
        shadowRadius: 4.65,
        elevation:9
    },
    addtext:{
        fontSize:35,
        alignSelf:'center',
        color:'white',
        
    },
    navoptions:{
        marginRight:15,
        flexDirection:'row',
        alignItems:'center',
        
    }
})