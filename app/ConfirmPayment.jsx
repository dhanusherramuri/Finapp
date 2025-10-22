import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Auth, db } from '../Firebaseconfig';

function ConfirmPayment() {
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [exp, setExp] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const user = Auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      const userDoc = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setAccount(data.accountNumber || '');
        if (data.cardDetails) {
          setName(data.cardDetails.name || '');
          const cardNumber = data.cardDetails.cardNumber || '';
          setCardLast4(cardNumber.slice(-4));
          setExp(data.cardDetails.expiry || '');
        }
      } else {
        Alert.alert('No user data found');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePayment = () => {
    // Simulate payment validation
    if (!name || !account || !cardLast4 || !exp) {
      Alert.alert('Error', 'Missing user or card details');
      return;
    }

    // Demo transaction successful
    Alert.alert('Payment Success', `Transaction completed for ${name}`);
    console.log("Payment Succeffull");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Payment</Text>

      <TextInput value={name} editable={false} placeholder='Name' style={styles.iptxt}/>
      <TextInput value={account} editable={false} placeholder='Account Number' style={styles.iptxt}/>
      <TextInput value={`**** **** **** ${cardLast4}`} editable={false} style={styles.iptxt}/>
      <TextInput value={exp} editable={false} style={styles.iptxt}/>

      <TouchableOpacity style={styles.bnkbtn} onPress={handlePayment}>
        <Text style={styles.btnText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  iptxt: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 15, backgroundColor: '#f2f2f2' },
  bnkbtn: { backgroundColor: '#2196F3', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default ConfirmPayment;
