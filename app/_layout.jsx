import { Stack, useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity } from "react-native";
import { Auth } from '../Firebaseconfig';



export default function RootLayout() {
  const router=useRouter();

    const handleLogout = () => {
    // Perform Firebase logout
    Auth.signOut().then(() => {
      router.push('/Login');
    }).catch((err) => Alert.alert('Error', err.message));
  };
  const handleConfirmPayment = () =>{
    router.push('/ConfirmPayment')
  }
  return (
    // <Stack>
    //   <Stack.Screen name="index" options={{ title: "Home" }} />
    //   <Stack.Screen name="Login" options={{ title: "Login" }} />
    //   <Stack.Screen name="Signup" options={{ title: "Signup" }} />
    //   <Stack.Screen name="Bank" options={{ title: "Bank" }} />
    //   <Stack.Screen name="ViewPaymentDetails" options={{ title: "Bank" }} />
    // </Stack>


    <Stack>
    <Stack.Screen
      name="index"
      options={{ title: "Home" }}
    />
    <Stack.Screen
      name="Login"
      options={{ title: "Login" }}
    />
    <Stack.Screen
      name="Signup"
      options={{ title: "Signup" }}
    />
    <Stack.Screen
      name="Bank"
      options={{
        title: "",
        headerRight: () => (
          <>
            <TouchableOpacity onPress={handleConfirmPayment}>
              <Text style={{ marginRight: 20, color: '#2196F3', fontSize: 16 }}>Confirm Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={{ color: '#f44336', fontSize: 16 }}>Logout</Text>
            </TouchableOpacity>
          </>
        ),
      }}
    />
    <Stack.Screen
      name="ConfirmPayment"
      options={{ title: "Confirm Payment" }}
    />
  </Stack>
  );
}
