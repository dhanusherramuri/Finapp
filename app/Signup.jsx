// import { useRouter } from 'expo-router';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import React, { useState } from 'react';
// import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { Auth } from '../Firebaseconfig';
// import styles from './Style';
// function Signup() {
//     const router = useRouter();
//     // const navigation = useNavigation();
//     const [username,setUsername]= useState('');
//     const [password,setPassword]= useState('');
//     const [cfmpassword,setcfmPassword]= useState('');
//     const reg = async ()=>{
//       if (!username || !password|| !username.trim() || !password.trim() || !cfmpassword || !cfmpassword.trim()) {
//         Alert.alert('Error', 'Please enter both username and password');
//         return;
//       }
//       if (password !== cfmpassword) {
//         console.log("Passwords Dont Match");
//         Alert.alert('Error', 'Passwords do not match!');
//         return;
//       }
      
//       try{
//   const user= await createUserWithEmailAndPassword(Auth,username,password);
//             console.log('Success');
//             Alert.alert('Success', `Registered in as ${username}`);
//             router.push("/Bank")
//       }
//       catch (error){
//         console.log(error.message);
//         Alert.alert(error.message);
//       }

//     };
//   return (
//     <View>
//       <Text style={{ 
//   textAlign: 'center', 
//   fontWeight: 'bold', 
//   fontSize: 20, 
//   marginVertical: 10 
// }}>
//   SignUp
// </Text>

//         <TextInput placeholder='Enter Your Mail ID'  isrequired="true" value={username} onChangeText={setUsername} style={styles.iptxt}/>
//         <TextInput placeholder='Enter Your Password'  isrequired="true" value={password} onChangeText={setPassword} secureTextEntry style={styles.iptxt}/>
//         <TextInput placeholder='Confirm Your Password' maxLength={10} isrequired="true" value={cfmpassword} onChangeText={setcfmPassword} secureTextEntry style={styles.iptxt}/>
//         <TouchableOpacity  onPress={reg} style={styles.bnkbtn}><Text style={styles.btnText}>Signup</Text></TouchableOpacity>
//         <TouchableOpacity onPress={()=> router.push("/Login")}><Text style={styles.lnktxt}>Already User? Login</Text></TouchableOpacity>
//     </View>
//   )
// }

// export default Signup


import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Auth } from '../Firebaseconfig';
import styles from './Style';

function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cfmpassword, setcfmPassword] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const reg = async () => {
    if (!username || !password || !cfmpassword || !username.trim() || !password.trim() || !cfmpassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!emailRegex.test(username)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password !== cfmpassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      await createUserWithEmailAndPassword(Auth, username, password);
      Alert.alert('Success', `Registered as ${username}`);
      router.push("/Bank");
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ 
        textAlign: 'center', 
        fontWeight: 'bold', 
        fontSize: 20, 
        marginVertical: 10 
      }}>
        Sign Up
      </Text>

      <TextInput
        placeholder='Enter Your Email'
        value={username}
        onChangeText={setUsername}
        style={styles.iptxt}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder='Enter Your Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.iptxt}
      />
      <TextInput
        placeholder='Confirm Your Password'
        value={cfmpassword}
        onChangeText={setcfmPassword}
        secureTextEntry
        style={styles.iptxt}
      />

      <TouchableOpacity onPress={reg} style={styles.bnkbtn}>
        <Text style={styles.btnText}>Signup</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Login")}>
        <Text style={styles.lnktxt}>Already a user? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Signup;
