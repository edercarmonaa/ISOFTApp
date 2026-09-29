import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';


import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from "react-native-orientation-locker";

import Loader from './Components/Loader';
import {getApiUrl} from './config';

const LoginScreen = ({navigation}) => {

  const [user_email, setUserEmail] = useState('');
  const [user_password, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  
  const passwordInputRef = createRef();


  

  const handleSubmitPress = () => {
    setErrortext('');
    if (!user_email) {
      setErrortext('Por favor escribe tu email');
      return;
    }
    if (!user_password) {
      setErrortext('Por favor esribe tu contraseña');
      return;
    }
    setLoading(true);
    var dataToSend = {
      user_email: user_email,
      user_password: user_password,
    };
    var formBody = [];
    
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    fetch(getApiUrl('/api/login'), {
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
          if( responseJson.error.hasOwnProperty('user_email') ) {
            setErrortext('Introduzca una direccion de email valida');
          }
        }else{
          if (responseJson.success == true) {
            AsyncStorage.setItem('user_id', user_email);
            AsyncStorage.setItem('token', responseJson.token);
            navigation.replace('DrawerNavigationRoutes');
          } else {
            setErrortext(responseJson.message);
          }
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };
  return (
    
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../Image/logo.png')}
                style={{
                  width: '100%',
                  height: 150,
                  resizeMode: 'contain',
                  margin: 0,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(user_email) =>
                  setUserEmail(user_email)
                }
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                blurOnSubmit={false}
                mode="outlined"
                label="Direccion de Correo electronico"
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(user_password) =>
                  setUserPassword(user_password)
                }
                mode="outlined"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                returnKeyType="next"
                label="Contraseña"
                secureTextEntry
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>
                {errortext}
              </Text>
            ) : null}
           
            <Button icon="login" mode="contained" onPress={handleSubmitPress} style={styles.buttonStyle}>
            Iniciar Sesión
            </Button>
            
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('RegisterScreen')}>
              Usuario Nuevo? Registrarse
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 60,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },

  buttonStyle: {
    height: 40,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
  },
  registerTextStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});
