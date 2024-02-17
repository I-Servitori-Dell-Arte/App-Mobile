import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import loading from '../../assets/loading.json';
import success from '../../assets/success.json';

const SetTessera = ({ navigation, route }) => {
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
      email: email.toLowerCase(),
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
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          email: email.toLowerCase(),
          numeroTessera: numTessera,
          name: name,
        }),
        redirect: "follow",
      };
      fetch(network.serverip + "/associa-tessera", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success === true) {
          console.log("Tessera associata con successo", result.data);
          navigation.navigate('login');
        } else {
          console.log("Errore durante la creazione della tessera", result.message);
        }
      })
      .catch((error) => {
        console.log("Errore:", error);
      });
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
            <Text style={{color: '#FFF', marginVertical: 5, fontSize: 16, textAlign: 'center'}}>Associa la tua tessera</Text>
            <View>
                <Text style={{color: '#FFF', marginVertical: 5, fontSize: 12}}>Nome completo: {name}</Text>
                <Text style={{color: '#FFF', marginVertical: 5, fontSize: 12}}>Email: {email}</Text>
            </View>
            <View>
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
          </View>
        </ScrollView>
      )}

        <TouchableOpacity style={styles.btnAvanti} onPress={isYes ? () => handleAssocia() : () => handleCrea()}>
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
    height: 100,
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
  },
  paga: {
    bottom: 0,
    padding: 15,
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
});
