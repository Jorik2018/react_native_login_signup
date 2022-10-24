// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef} from 'react';
import Alert from "react-native-awesome-alerts";
import * as Facebook from "expo-facebook";
import {
  StyleSheet,
  TextInput,
  Button,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Loader from './Components/Loader';

const RegisterScreen = (props) => {
  const [alert2, alert] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const nameInputRef = createRef();
  const emailInputRef = createRef();
  const ageInputRef = createRef();
  const addressInputRef = createRef();
  const appId = "1047121222092614";

  const onFbLoginPress = async () => {
    try {
      await Facebook.initializeAsync({
        appId,
      });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });
      if (type === "success") {
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        alert("Logged in!"+` Hi ${(await response.json()).name}!`);
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  const handleSubmitButton = () => {
    setErrortext('');
    if (!userName) {
      alert('Please fill Name');
      return;
    }
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userAge) {
      alert('Please fill Age');
      return;
    }
    if (!userAddress) {
      alert('Please fill Address');
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      user_name: userName,
      user_email: userEmail,
      user_age: userAge,
      user_address: userAddress,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('https://aboutreact.herokuapp.com/register.php', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status == 1) {
          setIsRegistraionSuccess(true);
          console.log('Registration Successful. Please Login to proceed');
        } else {
          setErrortext('Registration Unsuccessful');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };
  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#307ecc',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../Image/success.png')}
          style={{height: 150, resizeMode: 'contain', alignSelf: 'center'}}
        />
        <Text style={styles.successTextStyle}>Registration Successful.</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{
      justifyContent: 'center',
      alignContent: 'center',
      flex: 1,
      backgroundColor: '#0f61ab',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
    <View style={{    
        maxWidth: 360,
        width: '100%',
        margin: 20,
        backgroundColor: '#fff',
        flex: 1
      }}>
      

      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../Image/aboutreact.png')}
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
              onChangeText={(UserName) => setUserName(UserName)}
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                ageInputRef.current && ageInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserAddress) => setUserAddress(UserAddress)}
              underlineColorAndroid="#f000"
              placeholder="Enter Address"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              ref={addressInputRef}
              returnKeyType="next"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
          {errortext != '' ? (
            <Text style={styles.errorTextStyle}> {errortext} </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>Registrar</Text>
          </TouchableOpacity>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
  <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
  <View>
    <Text style={{width: 70, textAlign: 'center'}}>o usando</Text>
  </View>
  <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
</View>
         
       <TouchableOpacity
            style={{...styles.buttonStyle,backgroundColor:'#1877f2',marginBottom: 0}}
            activeOpacity={0.5}
            onPress={onFbLoginPress}>
            <Text style={styles.buttonTextStyle}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.buttonStyle,backgroundColor:'#ea4335',marginBottom: 0}}
            activeOpacity={0.5}
            onPress={onFbLoginPress}>
            <Text style={styles.buttonTextStyle}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.buttonStyle,backgroundColor:'#0a66c2',marginBottom: 0}}
            activeOpacity={0.5}
            onPress={onFbLoginPress}>
            <Text style={styles.buttonTextStyle}>LinkedIn</Text>
          </TouchableOpacity>
</KeyboardAvoidingView>
      </ScrollView>
      <Alert
          show={!!alert2}
          message={alert2}
          onDismiss={()=>{alert('')}}
          closeOnTouchOutside={true}
        />
    </View>
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,

    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#dadae8',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});
