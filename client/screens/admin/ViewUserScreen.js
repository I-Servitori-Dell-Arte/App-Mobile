import {
    StyleSheet,
    Text,
    StatusBar,
    View,
    ScrollView,
    TouchableOpacity,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { colors, network } from "../../constants";
  import { Ionicons } from "@expo/vector-icons";
  import CustomAlert from "../../components/CustomAlert/CustomAlert";
  import ProgressDialog from "react-native-progress-dialog";
  import BasicProductList from "../../components/BasicProductList/BasicProductList";
  import CustomButton from "../../components/CustomButton";
  import DropDownPicker from "react-native-dropdown-picker";
  import moment from "moment";
  import WishList from "../../components/WishList/WishList";
  
  const ViewUserScreen = ({ navigation, route }) => {
    const { user, Token, orderDetail } = route.params;
    console.log(user.wishlist);
    const [isloading, setIsloading] = useState(false);
    const [label, setLabel] = useState("Loading..");
    const [error, setError] = useState("");
    const [alertType, setAlertType] = useState("error");
    const [totalCost, setTotalCost] = useState(0);
    const [address, setAddress] = useState("");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [statusDisable, setStatusDisable] = useState(false);
    const [items, setItems] = useState([
      { label: "Pending", value: "pending" },
      { label: "Shipped", value: "shipped" },
      { label: "Delivered", value: "delivered" },
    ]);
  
    //method to convert the time into AM PM format
    function tConvert(time) {
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      if (time.length > 1) {
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join("");
    }
  
    //method to convert the Data into dd-mm-yyyy format
    const dateFormat = (datex) => {
      let t = new Date(datex);
      const date = ("0" + t.getDate()).slice(-2);
      const month = ("0" + (t.getMonth() + 1)).slice(-2);
      const year = t.getFullYear();
      const hours = ("0" + t.getHours()).slice(-2);
      const minutes = ("0" + t.getMinutes()).slice(-2);
      const seconds = ("0" + t.getSeconds()).slice(-2);
      const time = tConvert(`${hours}:${minutes}:${seconds}`);
      const newDate = `${date}-${month}-${year}, ${time}`;
  
      return newDate;
    };
  
    //method to update the status using API call
    const handleUpdateStatus = (id) => {
      setIsloading(true);
      setError("");
      setAlertType("error");
      var myHeaders = new Headers();
      myHeaders.append("x-auth-token", Token);
  
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      console.log(
        `Link:${network.serverip}/admin/order-status?orderId=${id}&status=${value}`
      );
  
      fetch(
        `${network.serverip}/admin/order-status?orderId=${id}&status=${value}`,
        requestOptions
      ) //API call
        .then((response) => response.json())
        .then((result) => {
          if (result.success == true) {
            setError(`Order status is successfully updated to ${value}`);
            setAlertType("success");
            setIsloading(false);
          }
        })
        .catch((error) => {
          setAlertType("error");
          setError(error);
          console.log("error", error);
          setIsloading(false);
        });
    };
  
    // calculate the total cost and set the all requried variables on initial render
    useEffect(() => {
      setError("");
      setAlertType("error");
      if (orderDetail?.status == "delivered") {
        setStatusDisable(true);
      } else {
        setStatusDisable(false);
      }
      setValue(orderDetail?.status);
      setAddress(
        orderDetail?.country +
          ", " +
          orderDetail?.city +
          ", " +
          orderDetail?.shippingAddress
      );
      setTotalCost(
        orderDetail?.items.reduce((accumulator, object) => {
          return (accumulator + object.price) * object.quantity;
        }, 0) // calculate the total cost
      );
    }, []);
    return (
      <View style={styles.container}>
        <ProgressDialog visible={isloading} label={label} />
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
        <View style={styles.screenNameContainer}>
          <View>
            <Text style={styles.screenNameText}>Dettagli Utente</Text>
          </View>
          <View>
            <Text style={styles.screenNameParagraph}>
              Vedi tutti i dettagli sull'utente {user.name ? user.name : ''}
            </Text>
          </View>
        </View>
        <CustomAlert message={error} type={alertType} />
        <ScrollView
          style={styles.bodyContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.containerNameContainer}>
            <View>
              <Text style={styles.containerNameText}>Info</Text>
            </View>
          </View>
          <View style={styles.ShipingInfoContainer}>
            <Text style={styles.secondarytextMedian}>
              {user?.name}
            </Text>
            <Text style={styles.secondarytextMedian}>
              {user?.email}
            </Text>
            <Text style={styles.secondarytextMedian}>{user?.tessera?.cellulare}</Text>
            <Text style={styles.secondarytextSm}>Indirizzo: {user?.tessera?.residenza}</Text>
            <Text style={styles.secondarytextSm}>CF: {user?.tessera?.codiceFiscale}</Text>
            <Text style={styles.secondarytextSm}>Data di nascita: {user?.tessera?.dataNascita}</Text>
          </View>
          <View>
            <Text style={styles.containerNameText}>Dettagli tessera</Text>
          </View>
          <View style={styles.orderInfoContainer}>
            <Text style={styles.secondarytextMedian}>
              Numero tessera: {user?.tessera?.numeroTessera}
            </Text>
            <Text style={styles.secondarytextMedian}>
                Data di scadenza: {user?.tessera?.dataScadenza ? moment(user.tessera.dataScadenza).format('DD/MM/YYYY') : ''}
            </Text>
          </View>

          <View>
            <Text style={styles.containerNameText}>Preferiti dell'utente</Text>
          </View>
          {user.wishlist && user.wishlist.length > 0 ? (
            user.wishlist?.map((list, index) => {
                return (
                    <WishList
                    image={`${network.serverip}/uploads/${list?.productId?.image}`}
                    title={list?.productId?.title}
                    description={list?.productId?.description}
                    key={index}
                    user={false}
                  />  
                )} 
            )

          ) : (
            <View style={styles.orderInfoContainer}>
                <Text style={styles.secondarytextMedian}>
                    Nessun Preferito
                </Text>
            </View>
          )}

          <View style={styles.emptyView}></View>
        </ScrollView>
      </View>
    );
  };
  
  export default ViewUserScreen;
  
  const styles = StyleSheet.create({
    container: {
      flexDirecion: "row",
      backgroundColor: colors.light,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      paddingBottom: 0,
      flex: 1,
      paddingTop: 40,
    },
    TopBarContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  
    screenNameContainer: {
      marginTop: 10,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginBottom: 5,
    },
    screenNameText: {
      fontSize: 30,
      fontWeight: "800",
      color: colors.muted,
    },
    screenNameParagraph: {
      marginTop: 10,
      fontSize: 15,
    },
    bodyContainer: { flex: 1, width: "100%", padding: 5 },
    ShipingInfoContainer: {
      marginTop: 5,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      backgroundColor: colors.white,
      padding: 10,
      borderRadius: 10,
      borderColor: colors.muted,
      elevation: 5,
      marginBottom: 10,
    },
    containerNameContainer: {
      marginTop: 10,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    containerNameText: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.muted,
    },
    secondarytextSm: {
      color: colors.muted,
      fontSize: 13,
    },
    orderItemsContainer: {
      marginTop: 5,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      backgroundColor: colors.white,
      padding: 10,
      borderRadius: 10,
  
      borderColor: colors.muted,
      elevation: 3,
      marginBottom: 10,
    },
    orderItemContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    orderItemText: {
      fontSize: 13,
      color: colors.muted,
    },
    orderSummaryContainer: {
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: 10,
      maxHeight: 220,
      width: "100%",
      marginBottom: 5,
    },
    bottomContainer: {
      backgroundColor: colors.white,
      width: "110%",
      height: 70,
      borderTopLeftRadius: 10,
      borderTopEndRadius: 10,
      elevation: 5,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
  
      paddingLeft: 10,
      paddingRight: 10,
    },
    orderInfoContainer: {
      marginTop: 5,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      backgroundColor: colors.white,
      padding: 10,
      borderRadius: 10,
  
      borderColor: colors.muted,
      elevation: 1,
      marginBottom: 10,
    },
    primarytextMedian: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "bold",
    },
    secondarytextMedian: {
      color: colors.muted,
      fontSize: 15,
      fontWeight: "bold",
    },
    emptyView: {
      height: 20,
    },
  });