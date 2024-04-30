import {
    StyleSheet,
    Text,
    Image,
    StatusBar,
    View,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    TextInput,
  } from "react-native";
  import React, { useState } from "react";
  import { colors, network } from "../../constants";
  import CustomInput from "../../components/CustomInput";
  import header_logo from "../../assets/logo-serv.png";
  import CustomButton from "../../components/CustomButton";
  import { Ionicons } from "@expo/vector-icons";
  import CustomAlert from "../../components/CustomAlert/CustomAlert";
  import InternetConnectionAlert from "react-native-internet-connection-alert";
  
  const AddUser = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [numTessera, setNumTessera] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("")
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const requestBody = {
      email: email.toLowerCase(),
      password: password,
      name: name,
      numTessera: numTessera,
      userType: "USER",
    };
  
    const requestOptions = {
      method: "POST",
      headers: {
        ...myHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      redirect: "follow",
    };
  
    const signUpHandle = () => {
      console.log(email, name, password, numTessera);
      if (email == "") {
        return setError("Inserisci l'email");
      }
      if (numTessera == "") {
        return setError("Inserisci la tessera");
      }
      if (name == "") {
        return setError("Inserisci il nome");
      }
      if (password == "") {
        return setError("Inserisci la password");
      }
      if (!email.includes("@")) {
        return setError("Email non valida");
      }
      if (email.length < 6) {
        return setError("Email troppo corta");
      }
      if (password.length < 5) {
        return setError("Password deve avere più di 5 caratteri");
      }
      if (password != confirmPassword) {
        return setError("Le password non combaciano");
      }
      fetch(network.serverip + "/register", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
          }
          console.log('RESPONSE:', response);
          return response.json();
        })
        .then((data) => {
          const userData = data.data
          console.log('DATA:', userData.email);
          if (userData && userData.email == email.toLowerCase()) {
            //navigation.navigate("viewusers");
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setName("")
            setNumTessera("")
            setMessage("Utente registrato con successo!")
          } else {
            console.log("Email not found in response");
          }
        })
        .catch((error) => {
          console.log("error", error); 
          setError(error.message || "An error occurred");
        });
    };
    return (
      <InternetConnectionAlert
        onChange={(connectionState) => {
          console.log("Connection State: ", connectionState);
        }}
      >
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar></StatusBar>
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
          <ScrollView style={{ flex: 1, width: "100%" }}>
            <View style={styles.welconeContainer}>
              <Image style={styles.logo} source={header_logo} />
            </View>
            <View style={styles.screenNameContainer}>
              <View>
                <Text style={styles.screenNameText}>Registra il socio</Text>
              </View>
              <View>
                <Text style={styles.screenNameParagraph}>
                  Crea un account e inserisci il numero tessera che hai già creato in precedenza, il sistema l'associerà automaticamente
                </Text>
              </View>
            </View>
            <View style={styles.formContainer}>
              <CustomAlert message={error} type={"error"} />
              <CustomAlert message={message} type={"success"} />
              <CustomInput
                value={name}
                setValue={setName}
                placeholder={"Nome"}
                placeholderTextColor={colors.muted}
                radius={5}
              />
              <CustomInput
                value={email}
                setValue={setEmail}
                placeholder={"Email"}
                placeholderTextColor={colors.muted}
                radius={5}
              />
              <CustomInput
                keyboardType="number-pad"
                placeholder={"Numero tessera"}
                value={numTessera}
                setValue={setNumTessera}
                placeholderTextColor={colors.muted}
                radius={5}
                />
              <CustomInput
                value={password}
                setValue={setPassword}
                secureTextEntry={true}
                placeholder={"Password"}
                placeholderTextColor={colors.muted}
                radius={5}
              />
              <CustomInput
                value={confirmPassword}
                setValue={setConfirmPassword}
                secureTextEntry={true}
                placeholder={"Conferma Password"}
                placeholderTextColor={colors.muted}
                radius={5}
              />
            </View>
          </ScrollView>
          <View style={styles.buttomContainer}>
            <CustomButton text={"Registra"} onPress={signUpHandle} />
          </View>
        </KeyboardAvoidingView>
      </InternetConnectionAlert>
    );
  };
  
  export default AddUser;
  
  const styles = StyleSheet.create({
    container: {
      flexDirecion: "row",
      backgroundColor: colors.light,
      alignItems: "center",
      justifyContent: "center",
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
    welconeContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "10%",
    },
    formContainer: {
      flex: 2,
      justifyContent: "flex-start",
      alignItems: "center",
      display: "flex",
      width: "100%",
      flexDirecion: "row",
      padding: 5,
    },
    logo: {
      resizeMode: "contain",
      width: 300,
    },
    forgetPasswordContainer: {
      marginTop: 10,
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    ForgetText: {
      fontSize: 15,
      fontWeight: "600",
    },
    buttomContainer: {
      width: "100%",
      marginBottom: 30,
    },
    bottomContainer: {
      marginTop: 10,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    signupText: {
      marginLeft: 2,
      color: colors.primary,
      fontSize: 15,
      fontWeight: "600",
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
      fontSize: 15,
    },
  });
  