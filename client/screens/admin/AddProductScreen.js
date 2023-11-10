import {
  StyleSheet,
  Text,
  Image,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import * as ImagePicker from "expo-image-picker";
import ProgressDialog from "react-native-progress-dialog";
import { AntDesign } from "@expo/vector-icons";
import { useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import mime from 'react-native-mime-types';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import 'moment/locale/it';
import DateTimePicker from '@react-native-community/datetimepicker';
moment.locale('it');

const AddProductScreen = ({ navigation, route }) => {
  const { authUser } = route.params;
  const [isloading, setIsloading] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [image, setImage] = useState("");
  const [imageChoose, setImageChoose] = useState("");
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [luogo, setLuogo] = useState("");
  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [statusDisable, setStatusDisable] = useState(false);
  const [items, setItems] = useState([
    { label: "Pending", value: "pending" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
  ]);
  var payload = [];

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const getToken = (obj) => {
    try {
      setUser(JSON.parse(obj));
    } catch (e) {
      setUser(obj);
      return obj.token;
    }
    return JSON.parse(obj).token;
  };

  //Method : Fetch category data from using API call and store for later you in code
  const fetchCategories = () => {
    var myHeaders = new Headers();
    myHeaders.append("x-auth-token", getToken(authUser));

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    setIsloading(true);
    fetch(`${network.serverip}/categories`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setCategories(result.categories);
          result.categories.forEach((cat) => {
            let obj = {
              label: cat.title,
              value: cat._id,
            };
            payload.push(obj);
          });
          setItems(payload);
          setError("");
        } else {
          setError(result.message);
        }
        setIsloading(false);
      })
      .catch((error) => {
        setIsloading(false);
        setError(error.message);
        console.log("error", error);
      });
  };

  var myHeaders = new Headers();
  myHeaders.append("x-auth-token", authUser.token);
  myHeaders.append("Content-Type", "application/json");

  const upload = async (image, imageName) => {
    console.log("upload-F:", image);
  
    try {
      const formdata = new FormData();
      formdata.append("photos", {
        uri: image,
        name: imageName,
        type: mime.lookup(imageName),
      });
  
      const ImageRequestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
  
      const response = await fetch(
        network.serverip + "/photos/upload",
        ImageRequestOptions
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("error", error);
    }
  };

  var raw = JSON.stringify({
    title: title,
    sku: sku,
    price: price,
    image: image,
    description: description,
    category: category,
    quantity: quantity,
    link: link,
    data: selectedDate,
    luogo: luogo,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  //Method for selecting the image from device gallery
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      console.log(selectedAsset.uri);
      const imageName = selectedAsset.uri.split('/').pop();
      setImage(imageName);
      setImageChoose(selectedAsset.uri);
      upload(selectedAsset.uri, imageName);
    }
  };

  //Method for imput validation and post data to server to insert product using API call
  const addProductHandle = () => {
    setIsloading(true);

    //[check validation] -- Start
    if (title == "") {
      setError("Per favore inserisci il titolo");
      setIsloading(false);
    } else if (quantity <= 0) {
      setError("La quantità deve essere maggiore di 1");
      setIsloading(false);
    } else if (image == null) {
      setError("Inserisci un'immagine");
      setIsloading(false);
    } else {
      //[check validation] -- End
      fetch(network.serverip + "/product", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.success == true) {
            setIsloading(false);
            setAlertType("success");
            setError(result.message);
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

  const onChangeDate = (event, selected) => {
    if (event.type === 'set') {
      setSelectedDate(selected);
    } else if (event.type === 'dismissed') {
      return
    }
  };

  //call the fetch functions initial render
  useEffect(() => {
    fetchCategories();
    console.log(categories);
  }, []);

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
          <Text style={styles.screenNameText}>Aggiungi prodotto</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>Aggiungi i dettagli del prodotto</Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "100%" }}
      >
        <View style={styles.formContainer}>
          <View style={styles.imageContainer}>
            {image ? (
              <TouchableOpacity style={styles.imageHolder} onPress={pickImage}>
                <Image
                  source={{ uri: imageChoose }}
                  style={{ width: 200, height: 200 }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.imageHolder} onPress={pickImage}>
                <AntDesign name="pluscircle" size={50} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>

          <CustomInput
            value={sku}
            setValue={setSku}
            placeholder={"SKU"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={title}
            setValue={setTitle}
            placeholder={"Titolo"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={link}
            setValue={setLink}
            placeholder={"Link negozio"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          {/*<CustomInput
            value={price}
            setValue={setPrice}
            placeholder={"Prezzo"}
            keyboardType={"number-pad"}
            placeholderTextColor={colors.muted}
            radius={5}
            />*/}
          <CustomInput
            value={quantity}
            setValue={setQuantity}
            placeholder={"Quantità"}
            keyboardType={"number-pad"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={description}
            setValue={setDescription}
            placeholder={"Descrizione"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={luogo}
            setValue={setLuogo}
            placeholder={"Seleziona Luogo"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
            <Button
              title="Seleziona Data"
              onPress={showDatePicker}
            />
          {/*selectedDate && (
            <Text>Data selezionata: {selectedDate.toDateString()}</Text>
          )*/}
          {/*<DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            locale="it-IT"
          />*/}
          <DateTimePicker
            value={selectedDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
          />
        </View>
      </ScrollView>
      <DropDownPicker
        placeholder={"Seleziona categoria prodotto"}
        open={open}
        value={category}
        items={items}
        setOpen={setOpen}
        setValue={setCategory}
        setItems={setItems}
        disabled={statusDisable}
        disabledStyle={{
          backgroundColor: colors.light,
          borderColor: colors.white,
        }}
        labelStyle={{ color: colors.muted }}
        style={{ borderColor: "#fff", elevation: 5 }}
      />
      <View style={styles.buttomContainer}>
        <CustomButton text={"Aggiungi"} onPress={addProductHandle} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddProductScreen;

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
    paddingBottom: 30,
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
