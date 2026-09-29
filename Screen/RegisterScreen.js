import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { Button, TextInput, Snackbar } from 'react-native-paper';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from "react-native-orientation-locker";
import AsyncStorage from '@react-native-community/async-storage';

import Loader from './Components/Loader';
import {getApiUrl} from './config';

const RegisterScreen = (props) => {
  const [user_name, setUserName] = useState('');
  const [user_email, setUserEmail] = useState('');
  const [user_password, setUserPassword] = useState('');
  const [user_phone, setUserPhone] = useState('');
  const [user_dire, setUserDire] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);
  const emailInputRef = createRef();
  const nameInputRef = createRef();
  const direInputRef = createRef();
  const passwordInputRef = createRef();
  const phoneInputRef = createRef();
  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => {
    setVisible(false);
    props.navigation.navigate('LoginScreen');
  }

  const handleSubmitButton = () => {
    setErrortext('');
    if (!user_name) {
      setErrortext('Por favor introduzca su nombre');
      return;
    }
    if (!user_email) {
      setErrortext('Por favor introduzca su email');
      return;
    }
    if (!user_phone) {
      setErrortext('Por favor introduzca su número de telefono');
      return;
    }
    if (!user_dire) {
      setErrortext('Por favor introduzca su dirección');
      return;
    }
    if (!user_password) {
      setErrortext('Por favor introduzca su contraseña');
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      user_name: user_name,
      user_email: user_email,
      user_phone: user_phone,
      user_dire: user_dire,
      user_password: user_password,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch(getApiUrl('/api/register'), {
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
            setErrortext('Ya existe un usuario Registrado con ese email');
          }else {
            setErrortext('Su contraseña debe tener almenos 6 caracteres');
          }
        }else{
          if (responseJson.success == true) {
            setIsRegistraionSuccess(true);
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
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
        >
        Usuario Registrado con exito!!!.
      </Snackbar>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
          flex: 1,
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../Image/logo.png')}
            style={{
              width: '50%',
              height: 100,
              resizeMode: 'contain',
              margin: 30,
            }}
          />
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(user_name) => setUserName(user_name)}
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                nameInputRef.current &&
                nameInputRef.current.focus()
              }
              blurOnSubmit={false}
              mode="outlined"
              label="Nombre"
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(user_email) => setUserEmail(user_email)}
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
              mode="outlined"
              label="Email"
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(user_password) => setUserPassword(user_password) }
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                passwordInputRef.current &&
                passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
              mode="outlined"
              label="Contraseña"
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(user_phone) => setUserPhone(user_phone)}
              keyboardType="numeric"
              ref={phoneInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                phoneInputRef.current &&
                phoneInputRef.current.focus()
              }
              blurOnSubmit={false}
              mode="outlined"
              label="Telefono"
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(user_dire) =>
                setUserDire(user_dire)
              }
              autoCapitalize="sentences"
              ref={direInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                direInputRef.current &&
                direInputRef.current.focus()
              }
              blurOnSubmit={false}
              mode="outlined"
              label="Dirección"
            />
          </View>
          {errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}
          <Button icon="account-plus" mode="contained" onPress={handleSubmitButton} style={styles.buttonStyle}>
          Registrar            
          </Button>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default RegisterScreen;

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
    margin: 5,
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
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'green',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});
