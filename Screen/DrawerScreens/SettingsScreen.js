import React, {useState, createRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button, TextInput, Snackbar } from 'react-native-paper';
import { OrientationLocker, PORTRAIT, LANDSCAPE } from "react-native-orientation-locker";

 	
import Loader from '../Components/Loader';
import {getApiUrl} from '../config';

const SettingsScreen =  (props) => {
  const [user_name, setUserName] = useState('');
  const [user_email, setUserEmail] = useState('');
  const [user_password, setUserPassword] = useState('');
  const [user_phone, setUserPhone] = useState('');
  const [user_dire, setUserDire] = useState('');
  const [loading, setLoading] = useState(false);
  const [tablet, setTablet] = useState('');
  const [visible, setVisible] = React.useState(false);
  const [errortext, setErrortext] = useState('');

  const emailInputRef = createRef();
  const nameInputRef = createRef();
  const direInputRef = createRef();
  const phoneInputRef = createRef();
  const passwordInputRef = createRef();

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setUserName('');
      setUserEmail('');
      setUserDire('');
      setUserPhone('');
      setUserPassword('');
      readData();
      isTablet();
    });
    return unsubscribe;
  },[props.navigation])

  const isTablet = async () => {
    setTablet(await AsyncStorage.getItem('istablet'));
  };
  
  const readData = async () =>{
    setLoading(true);
  const userToken = await AsyncStorage.getItem('token');
  const userEmail = await AsyncStorage.getItem('user_id');
  var url = new URL(getApiUrl('/api/show_user'));
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
          setUserName(responseJson.user_name);
          setUserEmail(responseJson.user_email);
          setUserPhone(responseJson.user_phone);
          setUserDire(responseJson.user_dire);
          setLoading(false);
        }
      }
    )
    .catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }
  
  const handleSubmitButton = async () => {
    const userToken = await AsyncStorage.getItem('token');
    const userEmail = await AsyncStorage.getItem('user_id');
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
      token: userToken,
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

    fetch(getApiUrl('/api/update_user'), {
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
            setErrortext('Su contraseña debe tener almenos 6 caracteres');
        }else{
          if (responseJson.success == true) {
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
     <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
        >
        Datos actualizados con exito!!!.
      </Snackbar>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(user_email) => setUserEmail(user_email)}
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              value={user_email}
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
              editable={false}
              mode="outlined"
              label="Email"
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(user_name) => setUserName(user_name)}
              autoCapitalize="sentences"
              returnKeyType="next"
              value={user_name}
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
              onChangeText={(user_password) => setUserPassword(user_password) }
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              value={user_password}
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
              value={user_phone}
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
              onChangeText={(user_dire) => setUserDire(user_dire)}
              autoCapitalize="sentences"
              ref={direInputRef}
              returnKeyType="next"
              value={user_dire}
              onSubmitEditing={() =>
                direInputRef.current &&
                direInputRef.current.focus()
              }
              blurOnSubmit={false}
              mode="outlined"
              label="Direccion"
            />
          </View>
          {errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}

            <Button icon="content-save" mode="contained" onPress={handleSubmitButton} style={styles.buttonStyle}>
            Guardar Cambios            
            </Button>
            <Button icon="window-close" mode="contained" onPress={() => props.navigation.navigate('HomeScreen')} style={styles.buttonStyle}>
            Cancelar            
            </Button>
        </KeyboardAvoidingView>
      </ScrollView>
 
    </View>
  );
};
export default SettingsScreen;

const styles = StyleSheet.create({
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
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 12,
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
  container: {
    flexDirection: "row",
    height: 100,
    padding: 20,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
});
