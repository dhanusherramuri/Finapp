import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Auth } from '../Firebaseconfig';
import styles from './Style';
function Login() {
    const router = useRouter();
    // const navigation = useNavigation();
    const [username,setUsername]= useState('');
    const [password,setPassword]= useState('');
    const login = async ()=>{
        if (!username || !password|| !username.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter both username and password');
            return;
          }
          try{
            const user = await signInWithEmailAndPassword(Auth,username,password);
            console.log('Success');
            Alert.alert('Success', `Logged in as ${username}`);
            router.push("/Bank")
          }
          catch(error){
            console.log(error);
            Alert.alert(error.message);
          }
    };
  return (
    <View>
      <Text style={{ 
  textAlign: 'center', 
  fontWeight: 'bold', 
  fontSize: 20, 
  marginVertical: 10 
}}>
  Login Page
</Text>

        <TextInput placeholder='Email' isrequired="true" value={username} onChangeText={setUsername} style={styles.iptxt}/>
        <TextInput placeholder='Password' isrequired="true" value={password} onChangeText={setPassword} secureTextEntry style={styles.iptxt}/>
        <TouchableOpacity  onPress={login} style={styles.bnkbtn}><Text style={styles.btnText}>Login</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=> router.push("/Signup")}><Text style={styles.lnktxt}>Signup</Text></TouchableOpacity>
    </View>
  )
}

export default Login