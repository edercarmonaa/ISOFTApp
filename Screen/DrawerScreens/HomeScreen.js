import React, {useState, createRef, useEffect, setState} from 'react';
import {View, Text, SafeAreaView, Image, ScrollView} from 'react-native';
import { Avatar, Card, Paragraph, Title, Button, Divider } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from "react-native-orientation-locker";
import AsyncStorage from '@react-native-community/async-storage';

import Loader from '../Components/Loader';
import {getApiUrl} from '../config';
const LeftContent = props => <Avatar.Icon {...props} icon="wallet-giftcard" />


const HomeScreen = (props) => {
  const [promotion, setPromotion] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(0);
  const [points2, setPoints2] = useState(0);
  const [win, setWin] = useState('');
  const [add, setAdd] = useState(0);
  const [percentage, setPerentage] = useState(0);
  
  const [tablet, setTablet] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      readData();
      readData2();
      isTablet();
    });
    return unsubscribe;
  },[props.navigation])


  const readData = async () =>{
    setLoading(true);
   const userToken = await AsyncStorage.getItem('token');
   const userEmail = await AsyncStorage.getItem('user_id');
   var url = new URL(getApiUrl('/api/get_promotion'));
   var params = {
     token: userToken,
   }
   Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
   fetch(url, {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
     },
   })
     .then((response) => response.json())
     .then((responseJson) => {
         if (responseJson.success == false) {
           setLoading(false);
         } else {
          setPromotion(responseJson[0].promotion_name);
          setDescription(responseJson[0].promotion_description);
          setLoading(false);
         }
       }
     )
     .catch((error) => {
       console.error(error);
      setLoading(false);
     });
   };

   const readData2 = async () =>{
  setLoading(true);
  const userToken = await AsyncStorage.getItem('token');
  const userEmail = await AsyncStorage.getItem('user_id');
   var url = new URL(getApiUrl('/api/point'));
   var params = {
     token: userToken,
     user_email: userEmail,
   }
   Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
   fetch(url, {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
     },
   })
     .then((response) => response.json())
     .then((responseJson) => {
         if (responseJson.success == false) {
           setLoading(false);
         } else {
          setPoints(responseJson.points);
          setPoints2(responseJson.points2);
          setWin(responseJson.prize);
          setAdd(responseJson.add);
          setPerentage(responseJson.percentage);
           setLoading(false);
         }
       }
     )
     .catch((error) => {
       console.error(error);
      setLoading(false);
     });
   }

  
  const isTablet = async () => {
    setTablet(await AsyncStorage.getItem('istablet'));
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      { tablet == 'false' &&
      <OrientationLocker
        orientation={PORTRAIT}
      />
    }
    { tablet == 'true' &&
      <OrientationLocker
        orientation={LANDSCAPE}
      />
    }
    <Loader loading={loading} />
    <ScrollView>
      <View style={{flex: 1}}>
      <Card>
      <Card.Cover 
        style={{
          resizeMode: 'center',
           backgroundColor: '#ffffff',
        }}
        source={{uri: 'https://gaseolo.blob.core.windows.net/promociones/promocion1.png'}} />
    <Card.Content style={{alignItems: 'center',}}>
      <Title>{promotion}</Title>
      <Paragraph>{description}</Paragraph>
    </Card.Content>
  </Card>
      <Divider />     
      <Card mode="elevated" style={{  marginTop: 10, }}>
        <Card.Title title="Este mes puedes ganar:"  left={LeftContent} />
        <Card.Content style={{alignItems: 'center',}}>
        <Title>{win}</Title>
          <AnimatedCircularProgress
            size={200}
            width={25}
            fill={percentage}
            tintColor="#00e0ff"
            alignItems='center'
            backgroundColor="#3d5875">
            {
              (fill) => (
                <Text>
                  {points} / {points2}
                </Text>
              )
            }
            </AnimatedCircularProgress>
            <Paragraph>Mejora tu premio sumando { add } puntos </Paragraph>
        </Card.Content>
      </Card>
      <Divider />  
      <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: 'grey',
          }}>
          Servi Gaseolo S. de RL. de CV
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: 'grey',
          }}>
          www.servigaseolo.com.mx
        </Text>          
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default HomeScreen;
