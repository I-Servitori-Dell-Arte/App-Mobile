import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { StripeProvider } from '@stripe/stripe-react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import loading from '../../assets/loading.json';
import success from '../../assets/success.json';
import LottieView from 'lottie-react-native';

function PaymentScreen({setVuolePagare, handleCrea, email}) {
  const { confirmPayment } = useStripe();
  const [clientSecret, setClientSecret] = useState(''); 
  console.log(clientSecret);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [ok, setOk] = useState(false);


  const fetchClientSecret = async () => {
    try {
      const email = 'email@example.com'; // Sostituisci con l'email desiderata
      const response = await fetch(network.serverip + "/create-payment", {
        method: "POST", // Cambia il metodo da "GET" a "POST"
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Passa l'email come corpo (body) della richiesta
      });
      const data = await response.json();
      console.log(data);
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClientSecret();
  }, []);

  const handlePayment = async () => {
    setPaymentInProgress(true);
    try {
      const { paymentMethodId } = await confirmPayment(clientSecret, {
        type: 'CardField',
        billingDetails: {
          email: 'example@example.com',
        },
      });

      // Esegui azioni supplementari dopo un pagamento riuscito
      setPaymentInProgress(false);
      setOk(true);
      setTimeout(() => {
        setVuolePagare(false);
        handleCrea();
      }, 10000)

      console.log('Pagamento riuscito con il metodo:', paymentMethodId);
    } catch (error) {
      console.error('Errore nel pagamento:', error);
    }
  };

  return (
    <>
    <CardField
      postalCodeEnabled={true}
      placeholders={{
        number: '4242 4242 4242 4242',
      }}
      cardStyle={{
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
      }}
      style={{
        width: '100%',
        height: 50,
        marginVertical: 30,
      }}
      onCardChange={(cardDetails) => {
        console.log('cardDetails', cardDetails);
      }}
      onFocus={(focusedField) => {
        console.log('focusField', focusedField);
      }}
    />
    {ok && (
      <LottieView
        source={success} 
        autoPlay
      />
    )}
    <TouchableOpacity style={styles.btnAvanti} onPress={clientSecret !== "" ? handlePayment : null}>
      <Text>{paymentInProgress ? "Pagamento in corso.." : "Paga"}</Text>
    </TouchableOpacity>
    </>
  );
}

const SetTessera = ({ navigation, route }) => {
  const publishableKey = "pk_test_51N1TzKKy8OcUrFfrGTKEGh0HfSc8ZzobBjnfpmOsakeUgPwXTbzEWq0KfRvBsyhwpdll82kjjIdmRyItCFWR2k7H00zS0JO6Zt";
  const { email, name } = route.params;
  const [numTessera, setNumTessera] = useState("");
  const [isYes, setIsYes] = useState(true);
  const [error, setError] = useState("");
  const [dataNascita, setDataNascita] = useState();
  const [residenza, setResidenza] = useState();
  const [cf, setCf] = useState();
  const [cellulare, setCellulare] = useState();

  const today = new Date();  
  const oneYearFromToday = new Date();
  oneYearFromToday.setFullYear(today.getFullYear() + 1);

  const day = oneYearFromToday.getDate();
  const month = oneYearFromToday.getMonth() + 1;  
  const year = oneYearFromToday.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      email: email
    }),
    redirect: "follow",
  };

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      email: email,
      name: name, 
      dataNascita: dataNascita,
      residenza: residenza,
      codiceFiscale: cf,
      cellulare: cellulare,
    }),
    redirect: "follow",
  };

    const handleCrea = () => {
      fetch(network.serverip + "/create-tessera", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success === true) {
          console.log("Tessera creata con successo", result.data);
          navigation.navigate('login');
        } else {
          console.log("Errore durante la creazione della tessera", result.message);
        }
      })
      .catch((error) => {
        console.log("Errore:", error);
        
      });
    };

    const [vuolePagare, setVuolePagare] = useState(false);
    const pagaPrima = () => {
      setVuolePagare(true);
    }

    const handleAssocia = () => {

    }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>Aggiungi la tessera</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>
            Con la nostra tessera annuale diventerai socio e potrai accedere a
            numerosi sconti. Possiedi già una tessera?
          </Text>
        </View>
        <View style={styles.buttonSiNoCont}>
        <TouchableOpacity style={styles.btn} onPress={() => setIsYes(true)}>
          <Text style={{ color: '#FFF', fontSize: 16 }}>Si</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setIsYes(false)}>
          <Text style={{ color: '#FFF', fontSize: 16 }}>No</Text>
        </TouchableOpacity>
        </View>
      </View>
      {isYes ? (
        <ScrollView style={styles.tessera}>
            <View>
                <Text style={{color: '#FFF', marginVertical: 5, fontSize: 12}}>Nome completo: {name}</Text>
                <Text style={{color: '#FFF', marginVertical: 5, fontSize: 12}}>Email: {email}</Text>
            </View>
            <View>
                <Text style={{color: '#FFF', marginVertical: 5, fontSize: 12}}>Data scadenza: {formattedDate && formattedDate}</Text> 
                <Text style={{color: '#FFF', marginVertical: 5, fontSize: 12}}>Numero Tessera: {numTessera}</Text>         
            </View>
            <View>
              <TextInput 
              keyboardType="number-pad"
              value={numTessera}
              onChangeText={(text) => setNumTessera(text)}
              style={styles.input}
              />
            </View>  
        </ScrollView>
      ) : ( 
        <ScrollView style={{ flex: 1, width: "100%", marginBottom: 60 }}>
           {!vuolePagare ? (
          <View style={styles.formContainer}>
            <CustomAlert message={error} type={"error"} />
            <CustomInput
              value={name}
              isDisabled={true}
              placeholder={"Nome"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
            <CustomInput
              value={email}
              isDisabled={true}
              placeholder={"Email"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
            <CustomInput
              value={dataNascita}
              setValue={setDataNascita}
              placeholder={"Data di nascita"}
              placeholderTextColor={colors.muted}
              radius={5}
              keyboardType={"numeric"}
            />
            <CustomInput
              value={residenza}
              setValue={setResidenza}
              placeholder={"Residenza"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
            <CustomInput
              value={cf}
              setValue={setCf}
              placeholder={"Codice Fiscale"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
            <CustomInput
              value={cellulare}
              setValue={setCellulare}
              placeholder={"Cellulare"}
              keyboardType='number-pad'
              placeholderTextColor={colors.muted}
              radius={5}
            />
          </View>)
          : 
        (<StripeProvider
        publishableKey={publishableKey}
        urlScheme="your-url-scheme"
        >
        <PaymentScreen setVuolePagare={setVuolePagare} handleCrea={handleCrea} email={email} />
      </StripeProvider>  
      )} 
        </ScrollView>
      )}

        <TouchableOpacity style={styles.btnAvanti} onPress={isYes ? () => handleAssocia() : () => pagaPrima()}>
          <Text style={{ color: '#FFF', fontSize: 16 }}>Prosegui</Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SetTessera;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    padding: 20,
    flex: 1,
    paddingTop: 40,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 12,
  },
  buttonSiNoCont: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '90%',
    margin: '0 auto',
    marginVertical: 20,
    marginLeft: 10,
  },
  btn: {
    paddingHorizontal: 60,
    backgroundColor: '#6B122F',
    borderRadius: 8,
    paddingVertical: 10,
  },
  input: {
    color: '#FFF',
    padding: 10,
    backgroundColor: colors.light_red
  },
  tessera: {
    width: '98%',
    height: 200,
    borderRadius: 10,
    backgroundColor: colors.light_black,
    color: '#FFF',
    marginTop: 10,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 60,
  },
  formContainer: {
    marginTop: 10,
    marginBottom: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirecion: "row",
  },
  btnSocio: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#C6663C',
    borderRadius: 40,
    color: '#FFF',
  },
  btnAvanti: {
    position: 'absolute',
    bottom: 15,
    padding: 15,
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: colors.primary,
  }
});
