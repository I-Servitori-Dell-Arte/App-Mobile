import {
    StyleSheet,
    Text,
    Image,
    StatusBar,
    View,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { colors, network } from "../../constants";
  import CustomInput from "../../components/CustomInput";
  import CustomButton from "../../components/CustomButton";
  import { Ionicons } from "@expo/vector-icons";
  import CustomAlert from "../../components/CustomAlert/CustomAlert";
  import * as ImagePicker from "expo-image-picker";
  import ProgressDialog from "react-native-progress-dialog";
  import { AntDesign } from "@expo/vector-icons";
  import moment from "moment";
  import DateTimePicker from '@react-native-community/datetimepicker';
  
  const EditTesseraScreen = ({ navigation, route }) => {
    const { product, authUser } = route.params;
    console.log(product);
    const [isloading, setIsloading] = useState(false);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("easybuycat.png");
    const [description, setDescription] = useState("");
    const [dataScadenza, setDataScadenza] = useState("");
    const [dataScadMod, setDataScadMod] = useState(new Date(product?.dataScadenza && product.dataScadenza));
    const [residenza, setResidenza] = useState("");
    const [phone, setPhone] = useState("");
    const [numeroTessera, setNumeroTessera] = useState("");
    const [error, setError] = useState("");
    const [alertType, setAlertType] = useState("error");
    const [user, setUser] = useState({});
  
    //Method to post the data to server to edit the category using API call
    const editCategoryHandle = (id) => {
      var myHeaders = new Headers();
      myHeaders.append("x-auth-token", authUser.token);
      myHeaders.append("Content-Type", "application/json");
  
      var raw = JSON.stringify({
        name: title,
        email: description,
        numeroTessera: numeroTessera,
        residenza: residenza,
        cellulare: phone,
        dataScadenza: dataScadMod,
      });
  
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
  
      setIsloading(true);
      //[check validations] -- Start
      if (title == "") {
        setError("Please enter the product title");
        setIsloading(false);
      } else if (description == "") {
        setError("Please upload the product image");
        setIsloading(false);
      } else if (image == null) {
        setError("Please upload the Catergory image");
        setIsloading(false);
      } else {
        //[check validations] -- End
        fetch(`${network.serverip}/update-tessera?id=${id}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.success == true) {
              setIsloading(false);
              setAlertType("success");
              setError(result.message);
              setTitle(result.data.name);
              setDescription(result.data.email);
              setNumeroTessera(result.data.numeroTessera);
            }
          })
          .catch((error) => {
            setIsloading(false);
            setError(error.message);
            setAlertType("error");
            console.log("error", error);
          });
      }
    };
  
    //inilize the title and description input fields on initial render
    useEffect(() => {
      setTitle(product?.name);
      setPhone(product?.cellulare ? product.cellulare : "");
      setResidenza(product?.residenza ? product.residenza : "");
      setDescription(product?.email ? product.email : "");
      setDataScadenza(product?.dataScadenza ? moment(product.dataScadenza).format('DD/MM/YYYY') : product.dataScadenza);
      setNumeroTessera(product?.numeroTessera);
    }, []);

    const onChangeDate = (event, selected) => {
      if (event.type === 'set') {
        setDataScadMod(selected);
        setDataScadMod(selected);
        console.log(selected);
      } else if (event.type === 'dismissed') {
        return
      }
    };
  
    return (
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar></StatusBar>
        <ProgressDialog visible={isloading} label={"Adding ..."} />
        <View style={styles.TopBarContainer}>
          <TouchableOpacity
            onPress={() => {
              // navigation.replace("viewproduct", { authUser: authUser });
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
            <Text style={styles.screenNameText}>Modifica tessera</Text>
          </View>
          <View>
            <Text style={styles.screenNameParagraph}>Aggiungi dettagli tessera</Text>
          </View>
        </View>
        <CustomAlert message={error} type={alertType} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: "100%" }}
        >
          <Text style={styles.screenNameParagraph}>Data di scadenza: {dataScadenza && dataScadenza}</Text>
          <View style={styles.formContainer}>
            <CustomInput
              value={title}
              setValue={setTitle}
              placeholder={"Nome completo"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
  
            <CustomInput
              value={description}
              setValue={setDescription}
              placeholder={"Email"}
              placeholderTextColor={colors.muted}
              radius={5}
            />

            <CustomInput
              value={numeroTessera}
              setValue={setNumeroTessera}
              placeholder={"Numero Tessera"}
              placeholderTextColor={colors.muted}
              radius={5}
            />

            <CustomInput
              value={residenza}
              setValue={setResidenza}
              placeholder={"Residenza"}
              placeholderTextColor={colors.muted}
              radius={5}
            />

            <CustomInput
              value={phone}
              setValue={setPhone}
              placeholder={"Cellulare"}
              placeholderTextColor={colors.muted}
              radius={5}
            />
          <Text style={{
            fontSize: 22,
            marginTop: 26,
            marginBottom: 10,
            fontWeight: '500',
            color: colors.muted,
            textAlign: 'center',
          }}>Modifica la data</Text>
          <DateTimePicker
            value={dataScadMod && dataScadMod}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
          />
          </View>
        </ScrollView>
  
        <View style={styles.buttomContainer}>
          <CustomButton
            text={"Modifica"}
            onPress={() => {
              editCategoryHandle(product?._id);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  export default EditTesseraScreen;
  
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
    formContainer: {
      flex: 2,
      justifyContent: "flex-start",
      alignItems: "center",
      display: "flex",
      width: "100%",
      flexDirecion: "row",
      padding: 5,
    },
  
    buttomContainer: {
      marginTop: 10,
      width: "100%",
    },
    bottomContainer: {
      marginTop: 10,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
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
    imageContainer: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
      height: 250,
      backgroundColor: colors.white,
      borderRadius: 10,
      elevation: 5,
      paddingLeft: 20,
      paddingRight: 20,
    },
    imageHolder: {
      height: 200,
      width: 200,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.light,
      borderRadius: 10,
      elevation: 5,
    },
  });
  