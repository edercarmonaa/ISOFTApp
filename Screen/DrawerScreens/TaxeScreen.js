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
  const [taxe_email, setTaxeEmail] = useState('');
  const [taxe_rfc, setTaxeRFC] = useState('');
  const [taxe_company, setTaxeCompany] = useState('');
  const [tablet, setTablet] = useState('');
  const [fetchurl, setURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [istaxe, setIsTaxe] = React.useState(false);
  const [errortext, setErrortext] = useState('');

  const emailInputRef = createRef();
  const rfcInputRef = createRef();
  const companyInputRef = createRef();

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setTaxeEmail('');
      setTaxeRFC('');
      setTaxeCompany('');
      setIsTaxe(false);
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
  var url = new URL(getApiUrl('/api/get_taxes'));
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
          setIsTaxe(false);
          setLoading(false);
        } else {
          setTaxeEmail(responseJson.taxe_email);
          setTaxeRFC(responseJson.taxe_rfc);
          setTaxeCompany(responseJson.taxe_company);
          setIsTaxe(true);
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
    if (!taxe_email) {
      setErrortext('Por favor introduzca email de facturacion');
      return;
    }
    if (!taxe_rfc) {
      setErrortext('Por favor introduzca un RFC');
      return;
    }
    if (!taxe_company) {
      setErrortext('Por favor introduzca su nombre o razon social');
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      token: userToken,
      user_email: userEmail,
      taxe_rfc: taxe_rfc,
      taxe_user: userEmail,
      taxe_email: taxe_email,
      taxe_company: taxe_company,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    if (istaxe){
      var url = getApiUrl('/api/update_taxes');
    }else{
      var url = getApiUrl('/api/taxes');
    }
    fetch(url, {
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
          if( responseJson.error.hasOwnProperty('taxe_rfc') ) {
            setErrortext('RFC Incorrecto');
          }else {
            setErrortext('Error al actualizar el registro');
          }
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
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(taxe_email) => setTaxeEmail(taxe_email)}
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              value={taxe_email}
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
              onChangeText={(taxe_company) => setTaxeCompany(taxe_company)}
              autoCapitalize="sentences"
              returnKeyType="next"
              value={taxe_company}
              onSubmitEditing={() =>
                companyInputRef.current &&
                companyInputRef.current.focus()
              }
              blurOnSubmit={false}
              mode="outlined"
              label="Nombre o Razon Social"
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(taxe_rfc) => setTaxeRFC(taxe_rfc) }
              ref={rfcInputRef}
              returnKeyType="next"
              autoCapitalize="characters"
              value={taxe_rfc}
              onSubmitEditing={() =>
                rfcInputRef.current &&
                rfcInputRef.current.focus()
              }
              blurOnSubmit={false}
              mode="outlined"
              label="RFC"
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
            {/*<Button icon="content-save" mode="contained" onPress={handleSubmitButton} style={styles.buttonStyle}>
            Facturar            
          </Button> */}
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
