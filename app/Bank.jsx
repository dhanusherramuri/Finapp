import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Auth, db } from '../Firebaseconfig';
import styles from './Style';
console.log('DB instance:', db);
console.log('Auth instance:', Auth);
function Bank() {
  const router = useRouter();
  const [accno, setAcc] = useState('');
  const [cardno, setCardNo] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [chln, setChln] = useState('');

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const updt = async () => {
    const user = Auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user logged in");
      return;
    }
    
    const cleanedAcc = accno.replace(/\s/g, '');
    if (!cleanedAcc.trim() || cleanedAcc.length < 10) {
      Alert.alert("Error", "Enter A Valid Account Number (minimum 10 digits)");
      return;
    }
    
    try {
      await setDoc(doc(db, "users", user.uid), { accountNumber: cleanedAcc }, { merge: true });
      Alert.alert("Success", "Account Number Added Successfully");
      setAcc('');
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
    }
  };

  const add = async () => {
    const user = Auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user logged in");
      return;
    }

    const cleanedCardNo = cardno.replace(/\s/g, '');
    
    if (!cleanedCardNo.trim() || cleanedCardNo.length !== 16) {
      Alert.alert("Error", "Enter A Valid 16-digit Card Number");
      return;
    }
    if (!chln.trim() || chln.length < 3) {
      Alert.alert("Error", "Enter A Valid Cardholder Name");
      return;
    }
    if (!exp.trim() || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) {
      Alert.alert("Error", "Enter A Valid Expiry Date (MM/YY)");
      return;
    }
    if (!cvv.trim() || cvv.length !== 3) {
      Alert.alert("Error", "Enter A Valid 3-digit CVV");
      return;
    }
    
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { 
          cardDetails: { 
            name: chln.trim(), 
            cardNumber: cleanedCardNo, 
            expiry: exp, 
            cvv: cvv 
          } 
        },
        { merge: true }
      );
      Alert.alert("Success", "Card Details Added Successfully");
      // Clear form
      setChln('');
      setCardNo('');
      setExp('');
      setCvv('');
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginVertical: 10 }}>
        Payment Details Page
      </Text>

      <TextInput 
        value={accno} 
        onChangeText={setAcc} 
        maxLength={20} 
        placeholder='Enter Your Account Number' 
        style={styles.iptxt} 
        keyboardType='number-pad'
      />
      <TouchableOpacity style={styles.bnkbtn} onPress={updt}>
        <Text style={styles.btnText}>Update Account Number</Text>
      </TouchableOpacity>

      <TextInput 
        value={chln} 
        onChangeText={setChln} 
        placeholder='Cardholder Name' 
        style={styles.iptxt}
        autoCapitalize='words'
      />
      <TextInput 
        value={cardno} 
        onChangeText={(text) => setCardNo(formatCardNumber(text))} 
        maxLength={19}
        placeholder='1234 5678 9012 3456' 
        style={styles.iptxt} 
        keyboardType='number-pad'
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput 
          value={exp} 
          onChangeText={(text) => setExp(formatExpiry(text))} 
          maxLength={5} 
          placeholder='MM/YY' 
          style={[styles.iptxt1, { flex: 1, marginRight: 10 }]}
          keyboardType='number-pad'
        />
        <TextInput 
          value={cvv} 
          onChangeText={setCvv} 
          maxLength={3} 
          placeholder='CVV' 
          style={[styles.iptxt1, { flex: 1 }]} 
          keyboardType='number-pad' 
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.bnkbtn} onPress={add}>
        <Text style={styles.btnText}>Add Card Details</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.bnkbtn, { backgroundColor: '#555', marginTop: 10 }]} 
        onPress={() => router.push("/ViewPaymentDetails")}
      >
        <Text style={styles.btnText}>View Payment Details</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Bank;