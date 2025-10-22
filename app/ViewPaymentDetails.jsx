import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Auth, db } from '../Firebaseconfig';

function ViewPaymentDetails() {
    const router = useRouter();
  const [accno, setAcc] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [exp, setExp] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = Auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not logged in');
        setLoading(false);
        return;
      }

      try {
        const userDoc = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const data = userSnap.data();
          let dataFound = false;

          if (data.accountNumber) {
            setAcc(data.accountNumber);
            dataFound = true;
          }

          if (data.cardDetails) {
            setCardName(data.cardDetails.name || '');
            const cardNumber = data.cardDetails.cardNumber || '';
            setCardLast4(cardNumber.slice(-4));
            setExp(data.cardDetails.expiry || '');
            dataFound = true;
          }

          setHasData(dataFound);
          
          if (!dataFound) {
            Alert.alert('Info', 'No payment details found. Please add payment details first.');
          }
        } else {
          Alert.alert('Info', 'No user data found');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array is fine since fetchData is defined inside useEffect

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading payment details...</Text>
      </View>
    );
  }

  if (!hasData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>No payment details available</Text>
        <Text style={styles.emptySubtext}>Add payment details to view them here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      <Text style={styles.subtitle}>(Read Only)</Text>

      {accno ? (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Account Number</Text>
          <TextInput 
            value={accno} 
            editable={false} 
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
      ) : null}

      {cardName ? (
        <>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput 
              value={cardName} 
              editable={false} 
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput 
              value={cardLast4 ? `**** **** **** ${cardLast4}` : 'N/A'} 
              editable={false} 
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput 
              value={exp || 'N/A'} 
              editable={false} 
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>
        </>
      ) : null}
      <TouchableOpacity 
  style={[styles.bnkbtn, { backgroundColor: '#2196F3', marginTop: 10 }]} 
  onPress={() => router.push("/ConfirmPayment")}
>
  <Text style={styles.btnText}>Confirm Payment</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    borderRadius: 10, 
    backgroundColor: '#f8f8f8',
    fontSize: 16,
    color: '#333',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default ViewPaymentDetails;