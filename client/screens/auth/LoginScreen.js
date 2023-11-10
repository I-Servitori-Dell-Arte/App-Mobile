import {
  StyleSheet,
  Image,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import React, { useState } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import header_logo from "../../assets/logo-serv.png";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(false);

  //method to store the authUser to aync storage
  _storeData = async (user) => {
    try {
      AsyncStorage.setItem("authUser", JSON.stringify(user));
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    email: email,
    password: password,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  //method to validate the user credentials and navigate to Home Screen / Dashboard
  const loginHandle = () => {
    setIsloading(true);
    //[check validation] -- Start
    // if email does not contain @ sign
    if (email == "") {
      setIsloading(false);
      return setError("Inserisci l'email");
    }
    if (password == "") {
      setIsloading(false);
      return setError("Inserisci la password");
    }
    if (!email.includes("@")) {
      setIsloading(false);
      return setError("Email non valida");
    }
    // length of email must be greater than 5 characters
    if (email.length < 6) {
      setIsloading(false);
      return setError("Email troppo corta");
    }
    // length of password must be greater than 5 characters
    if (password.length < 6) {
      setIsloading(false);
      return setError("La password deve avere più di 5 caratteri");
    }
    //[check validation] -- End

    fetch(network.serverip + "/login", requestOptions) // API call
      .then((response) => response.json())
      .then((result) => {
        if (
          result.status == 200 ||
          (result.status == 1 && result.success != false)
        ) {
          if (result?.data?.userType == "ADMIN") {
            //check the user type if the type is ADMIN then navigate to Dashboard else navigate to User Home
            _storeData(result.data);
            setIsloading(false);
            navigation.replace("dashboard", { authUser: result.data }); // naviagte to Admin Dashboard
          } else {
            console.log(result.data);
            _storeData(result.data);
            setIsloading(false);
            navigation.replace("tab", { user: result.data }); // naviagte to User Dashboard
          }
        } else {
          setIsloading(false);
          return setError(result.message);
        }
      })
      .catch((error) => {
        setIsloading(false);
        console.log("error", setError(error.message));
      });
  };

  return (
    <InternetConnectionAlert onChange={(connectionState) => {}}>
      <KeyboardAvoidingView
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView style={{ flex: 1, width: "100%" }}>
          <ProgressDialog visible={isloading} label={"Login ..."} />
          <StatusBar></StatusBar>
          <View style={styles.welconeContainer}>
            <View>
              <Image style={styles.logo} source={header_logo} />
            </View>
          </View>
          <View style={styles.screenNameContainer}>
            <Text style={styles.screenNameText}>Accedi</Text>
          </View>
          <View style={styles.formContainer}>
            <CustomAlert message={error} type={"error"} />
            <CustomInput
              value={email}
              setValue={setEmail}
              placeholder={"Email"}
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
            <View style={styles.forgetPasswordContainer}>
              <Text
                onPress={() => navigation.navigate("forgetpassword")}
                style={styles.ForgetText}
              >
                Password dimenticata?
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttomContainer}>
          <CustomButton text={"Accedi"} onPress={loginHandle} />
        </View>
        <View style={styles.bottomContainer}>
          <Text>Non hai ancora un account?</Text>
          <Text
            onPress={() => navigation.navigate("signup")}
            style={styles.signupText}
          >
            Registrati
          </Text>
        </View>
      </KeyboardAvoidingView>
    </InternetConnectionAlert>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
    paddingTop: 40,
  },
  welconeContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "10%",
    // padding:15
  },
  formContainer: {
    flex: 3,
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
  welcomeText: {
    fontSize: 34,
    fontWeight: "bold",
    color: colors.muted,
  },
  welcomeParagraph: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary_shadow,
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
    display: "flex",
    justifyContent: "center",
    width: "100%",
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
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
});
