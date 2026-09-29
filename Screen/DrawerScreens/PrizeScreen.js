import React, {useState, createRef, useEffect, setState} from 'react';
import { View, ScrollView, Image,  } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Divider, Title,   Paragraph, List} from 'react-native-paper';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from "react-native-orientation-locker";
import Moment from 'moment';


import CustomSlider from './Carousel/CustomSlider';
import styles from './Carousel/styles';

import Loader from '../Components/Loader';
import {getApiUrl} from '../config';


const PrizeScreen =  (props) => {
  const [loading, setLoading] = useState(false);
  const [datas, setData] = useState([]);
  const [promotion, setPromotion] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [rule, setRule] = useState('');
  const [tablet, setTablet] = useState('');

  useEffect(() => {
    Moment.locale('es');
    const unsubscribe = props.navigation.addListener('focus', () => {
      setData([]);
      isTablet();
      readData();
      readData2();
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
          setPromotion(responseJson[0].promotion_name);
          setStartDate(responseJson[0].promotion_startdate);
          setEndDate(responseJson[0].promotion_enddate);
          setDescription(responseJson[0].promotion_description);
          setRule(responseJson[0].rule[0].rule_description);
          setLoading(false);
         }
       }
     )
     .catch((error) => {
       console.error(error);
      setLoading(false);
     });
   }

   const readData2 = async () =>{
    setLoading(true);
   const userToken = await AsyncStorage.getItem('token');
   const userEmail = await AsyncStorage.getItem('user_id');
   var url = new URL(getApiUrl('/api/win'));
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
          setData(responseJson);
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
    <View >
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
      <ScrollView>
      <Loader loading={loading} />
      <Image
        style={styles.tinyLogo}
        source={require('../../Image/logo.png')}
      />
      <Title style={{textAlign: 'center',}}>{promotion}</Title>
      <Paragraph style={{textAlign: 'center',}}>{description}</Paragraph>
      <Paragraph style={{textAlign: 'center',}}>Vigencia: Del {Moment(startDate).format('D MMM Y')} al {Moment(endDate).format('D MMM Y')}</Paragraph>
      <Paragraph style={{textAlign: 'center',}}>{rule}</Paragraph>
      <Divider />
      <Title style={{textAlign: 'center',}}>Premios Obtenidos</Title>
      <Divider />
      {
        datas.map(item => {
            return(
              <List.Item 
              key={item.win_id.toString()}
              title={item.prize.prize_name}
              description={item.prize.prize_description}
              left={props => <List.Icon {...props} icon="gift" />}
            />
            );
        })
      }
      </ScrollView>
    </View>
  );
}


export default PrizeScreen;
