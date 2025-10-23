


import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Auth, db } from '../Firebaseconfig';
import styles from './Style';

function Bank() {
  const router = useRouter();
  const [accno, setAcc] = useState('');
  const [cardno, setCardNo] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [chln, setChln] = useState('');
  const [savedCards, setSavedCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const expRefAdd = useRef(null);
  const cvvRefAdd = useRef(null);
  const expRefEdit = useRef(null);
  const cvvRefEdit = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = Auth.currentUser;
    if (!user) return;

    try {
      const userDoc = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.accountNumber) setAcc(data.accountNumber);
        if (data.cardDetails) {
          setSavedCards([data.cardDetails]);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };



  
  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
  
    if (cleaned.length >= 2) {
      const month = parseInt(cleaned.slice(0, 2), 10);
      const year = cleaned.slice(2, 4);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
  
      if (month < 1 || month > 12) {
        return cleaned.slice(0, 1);
      }
  
      if (year && year.length === 2) {
        const yearNum = parseInt(year, 10);
        if (yearNum < currentYear) {
          return `${String(month).padStart(2, '0')}/`;
        }
        if (yearNum === currentYear && month < currentMonth) {
          return `${String(currentMonth).padStart(2, '0')}/`;
        }
      }
  
      formatted = `${String(month).padStart(2, '0')}/${year}`;
    }
  
    return formatted;
  };
  

  const updt = async () => {
    const user = Auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user logged in");
      return;
    }
    
    const cleanedAcc = accno.replace(/\s/g, '');
    if (!cleanedAcc.trim() || cleanedAcc.length !== 10) {
      Alert.alert("Error", "Enter A Valid Account Number (10 digits)");
      return;
    }
    
    try {
      await setDoc(doc(db, "users", user.uid), { accountNumber: cleanedAcc }, { merge: true });
      Alert.alert("Success", "Bank Details Updated Successfully");
      setShowAddCard(true);
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
      const cardData = { 
        name: chln.trim(), 
        cardNumber: cleanedCardNo, 
        expiry: exp, 
        cvv: cvv 
      };
      
      await setDoc(
        doc(db, "users", user.uid),
        { cardDetails: cardData },
        { merge: true }
      );
      
      Alert.alert("Success", "Card Details Added Successfully");
      setSavedCards([cardData]);
      setChln('');
      setCardNo('');
      setExp('');
      setCvv('');
      setShowAddCard(false);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
    }
  };

  // const deleteCard = async () => {
  //   Alert.alert(
  //     "Delete Card",
  //     "Are you sure you want to delete this card?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Delete",
  //         style: "destructive",
  //         onPress: async () => {
  //           const user = Auth.currentUser;
  //           if (!user) return;

  //           try {
  //             await updateDoc(doc(db, "users", user.uid), {
  //               cardDetails: null
  //             });
  //             setSavedCards([]);
  //             Alert.alert("Success", "Card deleted successfully");
  //           } catch (error) {
  //             Alert.alert("Error", error.message);
  //           }
  //         }
  //       }
  //     ]
  //   );
  // };

  const deleteCard = async () => {
    Alert.alert(
      "Delete Card",
      "Are you sure you want to delete this card?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const user = Auth.currentUser;
            if (!user) return;
  
            try {
              await updateDoc(doc(db, "users", user.uid), {
                cardDetails: null
              });
  
              setSavedCards([]);
              setCardNo("");
              setChln("");
              setExp("");
              setCvv("");
              setShowAddCard(true);
  
              Alert.alert("Success", "Card deleted successfully");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          }
        }
      ]
    );
  };
  

  const startEdit = () => {
    if (savedCards.length > 0) {
      const card = savedCards[0];
      setChln(card.name);
      setCardNo(formatCardNumber(card.cardNumber));
      setExp(card.expiry);
      setCvv(card.cvv);
      setShowEditModal(true);
    }
  };

  const updateCard = async () => {
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
      const cardData = { 
        name: chln.trim(), 
        cardNumber: cleanedCardNo, 
        expiry: exp, 
        cvv: cvv 
      };
      
      await setDoc(
        doc(db, "users", user.uid),
        { cardDetails: cardData },
        { merge: true }
      );
      
      Alert.alert("Success", "Card Details Updated Successfully");
      setSavedCards([cardData]);
      setShowEditModal(false);
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
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Account Number Section */}
      <View style={{ padding: 20 }}>
        <TextInput
          value={accno}
          onChangeText={setAcc}
          maxLength={10}
          placeholder='Enter Your Account Number'
          style={[styles.iptxt, { marginBottom: 15, fontSize: 16 }]}
          keyboardType='number-pad'
        />
        <TouchableOpacity
          style={[styles.bnkbtn, { backgroundColor: '#000', borderRadius: 15, padding: 18 }]}
          onPress={updt}
        >
          <Text style={[styles.btnText, { fontSize: 16, fontWeight: '600' }]}>
            Update Bank Details
          </Text>
        </TouchableOpacity>

        {/* Add Card Section */}
        {savedCards && savedCards.length === 0 ? (
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>Card Details</Text>
            <TextInput
              value={chln}
              onChangeText={setChln}
              placeholder='Cardholder Name'
              style={[styles.iptxt, { marginBottom: 15 }]}
              autoCapitalize='words'
            />
            <TextInput
              value={cardno}
              onChangeText={(text) => {
                const formattedText =formatCardNumber(text);
                setCardNo(formattedText);
                if (formattedText.length === 19) {
                  expRefAdd.current?.focus();
                }}}
              maxLength={19}
              placeholder='1234 5678 9012 3456'
              style={[styles.iptxt, { marginBottom: 15 }]}
              keyboardType='number-pad'
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
              <TextInput
              ref={expRefAdd}
                value={exp}
                onChangeText={(text) => {
                  const formattedText=formatExpiry(text);
                  setExp(formattedText);
                  if (formattedText.length === 5) {
                    cvvRefAdd.current?.focus();
                  }}}
                maxLength={5}
                placeholder='MM/YY'
                style={[styles.iptxt1, { flex: 1, marginRight: 10 }]}
                keyboardType='number-pad'
              />
              <TextInput
              ref={cvvRefAdd}
                value={cvv}
                onChangeText={setCvv}
                maxLength={3}
                placeholder='CVV'
                style={[styles.iptxt1, { flex: 1 }]}
                keyboardType='number-pad'
                secureTextEntry
              />
            </View>
            <TouchableOpacity
              style={[styles.bnkbtn, { backgroundColor: '#000', borderRadius: 15, padding: 18 }]}
              onPress={add}
            >
              <Text style={[styles.btnText, { fontSize: 16, fontWeight: '600' }]}>
                Add Card Details
              </Text>
            </TouchableOpacity>
          </View>
        ):
         (
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>
              Card Details
            </Text>


            {savedCards.map((card, index) => (
              <View 
                key={index}
                style={{
                  backgroundColor: '#f8f8f8',
                  borderRadius: 15,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                  marginBottom: 20
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
                  Saved Card
                </Text>
                <Text style={{ fontSize: 15, color: '#666', marginBottom: 20 }}>
                  ••{card.cardNumber.slice(-4)} | {card.name.toLowerCase()}
                </Text>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity 
                    style={{
                      flex: 1,
                      backgroundColor: '#000',
                      borderRadius: 15,
                      padding: 18,
                      alignItems: 'center'
                    }}
                    onPress={startEdit}
                  >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                      Edit Card
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={{
                      flex: 1,
                      backgroundColor: '#ff4444',
                      borderRadius: 15,
                      padding: 18,
                      alignItems: 'center'
                    }}
                    onPress={deleteCard}
                  >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                      Delete Card
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Edit Card Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end'
          }}>
            <View style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              padding: 20,
              paddingBottom: 40
            }}>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
              }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Edit Card</Text>
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <Text style={{ fontSize: 28, color: '#666' }}>×</Text>
                </TouchableOpacity>
              </View>

              <TextInput 
                value={chln} 
                onChangeText={setChln} 
                placeholder='Cardholder Name' 
                style={[styles.iptxt, { marginBottom: 15 }]}
                autoCapitalize='words'
              />
              <TextInput 
                value={cardno} 
                onChangeText={(text) => {
                  const formattedText=formatCardNumber(text);
                  setCardNo(formattedText);
                  if (formattedText.length === 19) {
                    expRefEdit.current?.focus();
                  }}} 
                maxLength={19}
                placeholder='1234 5678 9012 3456' 
                style={[styles.iptxt, { marginBottom: 15 }]}
                keyboardType='number-pad'
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                <TextInput
                ref={expRefEdit} 
                  value={exp} 
                  onChangeText={(text) => {
                    const formattedText=formatExpiry(text);
                    setExp(formattedText);
                  if(formattedText.length === 5){
                    cvvRefEdit.current?.focus();
                  }}} 
                  maxLength={5} 
                  placeholder='MM/YY' 
                  style={[styles.iptxt1, { flex: 1, marginRight: 10 }]}
                  keyboardType='number-pad'
                />
                <TextInput
                ref={cvvRefEdit}
                  value={cvv} 
                  onChangeText={setCvv} 
                  maxLength={3} 
                  placeholder='CVV' 
                  style={[styles.iptxt1, { flex: 1 }]} 
                  keyboardType='number-pad' 
                  secureTextEntry
                />
              </View>
              <TouchableOpacity 
                style={[styles.bnkbtn, { backgroundColor: '#000', borderRadius: 15, padding: 18 }]}
                onPress={updateCard}
              >
                <Text style={[styles.btnText, { fontSize: 16, fontWeight: '600' }]}>
                  Update Card
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

export default Bank;