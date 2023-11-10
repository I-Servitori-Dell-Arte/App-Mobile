import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import ProductList from "../../components/ProductList/ProductList";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomInput from "../../components/CustomInput/";
import ProgressDialog from "react-native-progress-dialog";

const ViewProductScreen = ({ navigation, route }) => {
  const { authUser } = route.params;
  const [isloading, setIsloading] = useState(false);
  const [refeshing, setRefreshing] = useState(false);
  const [alertType, setAlertType] = useState("error");

  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [filterItem, setFilterItem] = useState("");

  var myHeaders = new Headers();
  myHeaders.append("x-auth-token", authUser.token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var ProductListRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchProduct();
    setRefreshing(false);
  };

  //method to delete the specific order
  const handleDelete = (id) => {
    setIsloading(true);
    console.log(`${network.serverip}/delete-product?id=${id}`);
    fetch(`${network.serverip}/delete-product?id=${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          fetchProduct();
          setError(result.message);
          setAlertType("success");
        } else {
          setError(result.message);
          setAlertType("error");
        }
        setIsloading(false);
      })
      .catch((error) => {
        setIsloading(false);
        setError(error.message);
        console.log("error", error);
      });
  };

  //method for alert
  const showConfirmDialog = (id) => {
    if (typeof id !== "string") {
      console.error("id non è una stringa valida");
      return;
    }
    return Alert.alert(
      "Sei sicuro di eliminarlo?",
      [
        {
          text: "Si",
          onPress: () => {
            handleDelete(id);
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  //method the fetch the product data from server using API call
  const fetchProduct = () => {
    setIsloading(true);
    fetch(`${network.serverip}/products`, ProductListRequestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setProducts(result.data);
          setFoundItems(result.data);
          setError("");
          setIsloading(false);
        } else {
          setError(result.message);
          setIsloading(false);
        }
      })
      .catch((error) => {
        setError(error.message);
        console.log("error", error);
        setIsloading(false);
      });
  };

  //method to filer the orders for by title [search bar]
  const filter = () => {
    const keyword = filterItem;
    if (keyword !== "") {
      const results = products?.filter((product) => {
        return product?.title.toLowerCase().includes(keyword.toLowerCase());
      });
      setFoundItems(results);
    } else {
      setFoundItems(products);
    }
  };

  //filter the data whenever filteritem value change
  useEffect(() => {
    filter();
  }, [filterItem]);

  //fetch the categories on initial render
  useEffect(() => {
    fetchProduct();
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("addproduct", { authUser: authUser });
          }}
        >
          <AntDesign name="plussquare" size={30} color={colors.muted} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>Dashboard Prodotti</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>Vedi tutti i prodotti</Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <CustomInput
        radius={5}
        placeholder={"Cerca..."}
        value={filterItem}
        setValue={setFilterItem}
      />
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
        }
      >
        {foundItems && foundItems.length == 0 ? (
          <Text>{`Nessun prodotto trovato per ${filterItem}!`}</Text>
        ) : (
          foundItems.map((product, index) => {
            return (
              <ProductList
                key={index}
                image={`${network.serverip}/uploads/${product?.image}`}
                //image={`${network.serverip}/uploads/product-1696494345991.png`}
                title={product?.title}
                category={product?.category?.title}
                price={product?.luogo ? product.luogo : 'Nessun luogo'}
                qantity={product?.sku}
                onPressView={() => {
                  console.log("view is working " + product._id);
                }}
                onPressEdit={() => {
                  navigation.navigate("editproduct", {
                    product: product,
                    authUser: authUser,
                  });
                }}
                onPressDelete={() => {
                  //showConfirmDialog(product._id);
                  handleDelete(product._id);
                }}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default ViewProductScreen;

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
    justifyContent: "space-between",
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
});
