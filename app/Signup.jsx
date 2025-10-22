import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Auth } from '../Firebaseconfig';
import styles from './Style';
function Signup() {
    const router = useRouter();
    // const navigation = useNavigation();
    const [username,setUsername]= useState('');
    const [password,setPassword]= useState('');
    const [cfmpassword,setcfmPassword]= useState('');
    const reg = async ()=>{
      if (!username || !password|| !username.trim() || !password.trim() || !cfmpassword || !cfmpassword.trim()) {
        Alert.alert('Error', 'Please enter both username and password');
        return;
      }
      if (password !== cfmpassword) {
        console.log("Passwords Dont Match");
        Alert.alert('Error', 'Passwords do not match!');
        return;
      }
      
      try{
  const user= await createUserWithEmailAndPassword(Auth,username,password);
            console.log('Success');
            Alert.alert('Success', `Registered in as ${username}`);
            router.push("/Bank")
      }
      catch (error){
        console.log(error.message);
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
  SignUp
</Text>

        <TextInput placeholder='Enter Your Mail ID'  isrequired="true" value={username} onChangeText={setUsername} style={styles.iptxt}/>
        <TextInput placeholder='Enter Your Password'  isrequired="true" value={password} onChangeText={setPassword} secureTextEntry style={styles.iptxt}/>
        <TextInput placeholder='Confirm Your Password' maxLength={10} isrequired="true" value={cfmpassword} onChangeText={setcfmPassword} secureTextEntry style={styles.iptxt}/>
        <TouchableOpacity  onPress={reg} style={styles.bnkbtn}><Text style={styles.btnText}>Signup</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=> router.push("/Login")}><Text style={styles.lnktxt}>Already User? Login</Text></TouchableOpacity>
    </View>
  )
}

export default Signup