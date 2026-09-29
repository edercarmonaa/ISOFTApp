import React, { useState, useEffect, createRef, Fragment} from 'react';
import { View, Text, Image } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Button, TextInput,Snackbar} from 'react-native-paper';
import styles from './scanStyle'
import AsyncStorage from '@react-native-community/async-storage';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from "react-native-orientation-locker";
 	
import Loader from '../Components/Loader';
import {getApiUrl} from '../config';


const TicketScreen =  (props) => {

  const [scan, setScan] = useState(false);
  const [ScanResult, setScanResult] = useState(false);
  const [result, setResult] = useState('');
  const [ticket_id, setNumTicket] = useState('');
  const [tablet, setTablet] = useState('');
  const ticketInputRef = createRef();
  const [errortext, setErrortext] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => {
    setVisible(false);
  }
  
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setNumTicket('');
      isTablet();
      setResult('');
      setScan(false);
      setScanResult(false);
    });
    return unsubscribe;
  },[props.navigation])

  const onSuccess =  (e) => {
    setResult(e);
    if (!result.data){
      scanner.reactivate ();
    }else{
      setScan(false);
      setScanResult(true);
      setNumTicket(result.data);
    }

  };

  const isTablet = async () => {
    setTablet(await AsyncStorage.getItem('istablet'));
  };

  const activeQR = () => {
    setScan(true);
  };

  const scanAgain = () => {
    setScan(true);
    setScanResult(false);
  };

  
  const handleSubmitButton = async () => {
    setErrortext('');
    const userToken = await AsyncStorage.getItem('token');
    const userEmail = await AsyncStorage.getItem('user_id');
    if (!ticket_id) {
      setErrortext('Por favor introduzca un numero de ticket valido');
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      token: userToken,
      user_email: userEmail,
      ticket_id: ticket_id,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch(getApiUrl('/api/ticket'), {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type':
        'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
        if( responseJson.hasOwnProperty('error') ) {
          if (responseJson.error.hasOwnProperty('ticket_id')){
            setErrortext('El ticket ya se encuentra registrado');  
          }else{
            setErrortext(responseJson.error);
          }
        }else{
          if (responseJson.success == true) {
            setSuccess(responseJson.message);
            onToggleSnackBar();
          } else {
            setErrortext(responseJson.message);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };
  return (
<View style={{flex: 1, backgroundColor: '#FFFFFF', height: "100%"}}>

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
    <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
        >
        {success}
      </Snackbar>
    <Loader loading={loading} />
     <Fragment>
        <View style={{alignItems: 'center'}}>
        <Image
            source={require('../../Image/logo.png')}
            style={{
              width: '50%',
              height: 100,
              resizeMode: 'contain',
              margin: 30,
            }}
          />
          </View>
          <TextInput
              style={styles.inputStyle}
              editable={false}
              secureTextEntry={true}
              autoCapitalize="sentences"
              returnKeyType="next"
              value={ticket_id}
              onSubmitEditing={() =>
                nameInputRef.current &&
                nameInputRef.current.focus()
              }
              blurOnSubmit={false}
              mode="outlined"
              label="Ticket"
            />
            {!scan && !ScanResult && 
            <Button icon="camera" mode="contained" onPress={activeQR} style={styles.buttonStyle}>
              Escanear QR            
            </Button>
            }

            {ScanResult &&
                   
                    <View>
                        <Button icon="ticket" mode="contained" onPress={handleSubmitButton} style={styles.buttonStyle}>
                            Registrar Ticket            
                        </Button>
                        <Button icon="camera" mode="contained" onPress={scanAgain} style={styles.buttonStyle}>
                            Volver a escanear QR            
                        </Button>

                    </View>
                    
            }
            


            {scan &&
            <View style={{alignItems: 'center'}}>
                <QRCodeScanner
                style={{height: 50, width: 50, 
                  borderRadius: 10}}
                    reactivate={true}
                    showMarker={true}
                    cameraStyle={{ height: 400 }}
                    showMarker={true}
                    containerStyle={{height:400}}
                    ref={(node) => { scanner = node }}
                    onRead={onSuccess}
                    cameraProps={{captureAudio: false}}
                    bottomContent={
                        <View >
                            <Button icon="camera-off" mode="contained" onPress={() => setScan(false)} style={styles.buttonStyle}>
                                Detener Escanner            
                            </Button>
                        </View>
                    }
                />
                </View>
            }
             {errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}
             </Fragment>
        </View>
);
};
export default TicketScreen;
