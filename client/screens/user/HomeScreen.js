import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  RefreshControl,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Linking,
} from "react-native";
import tessera from '../../assets/tessera.png';
//import tesserafronte from '../../assets/tessera-fronte.jpg';
import tesserafronte from '../../assets/tessera-fronte1.png';
import tesseraretro from '../../assets/tessera-retro.jpg';
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import cartIcon from "../../assets/icons/cart_beg.png";
import scanIcon from "../../assets/icons/scan_icons.png";
import servitorilogo from "../../assets/i-servitori-dellarte2-logo.png";
import servitorilogo2 from "../../assets/logo-serv.png";
import { colors } from "../../constants";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import ProductCard from "../../components/ProductCard/ProductCard";
import { network } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import SearchableDropdown from "react-native-searchable-dropdown";
import { SliderBox } from "react-native-image-slider-box";
import menu from "../../assets/image/menu-icon.png";
import FlipCard from 'react-native-flip-card'
import moment from 'moment';
import CustomInput from "../../components/CustomInput";

const category = [
  {
    _id: "62fe244f58f7aa8230817f89",
    title: "Garments",
    image: require("../../assets/icons/garments.png"),
  },
  {
    _id: "62fe243858f7aa8230817f86",
    title: "Electornics",
    image: require("../../assets/icons/electronics.png"),
  },
  {
    _id: "62fe241958f7aa8230817f83",
    title: "Cosmentics",
    image: require("../../assets/icons/cosmetics.png"),
  },
  {
    _id: "62fe246858f7aa8230817f8c",
    title: "Groceries",
    image: require("../../assets/icons/grocery.png"),
  },
];

const slides = [
  require("../../assets/tessera-fronte.jpg"),
  require("../../assets/tessera-fronte.jpg"),
];

const HomeScreen = ({ navigation, route }) => {
  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();
  

  const { addCartItem } = bindActionCreators(actionCreaters, dispatch);

  const { user } = route.params;
  const name = user.name;
  const email = user.email;
  const numeroTessera = user.tessera ? user.tessera.numeroTessera : "Nessuna";
  const scadenza = user.tessera ? user.tessera.dataScadenza : "Nessuna";
  const formattedDate = moment(scadenza).format('DD/MM/YYYY');
  const [products, setProducts] = useState([]);
  const [productsOr, setProductsOr] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [searchItems, setSearchItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterItem, setFilterItem] = useState("");
  const [loadImg, setLoadImg] = useState(false);

  //method to convert the authUser to json object
  const convertToJSON = (obj) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };

  //method to navigate to product detail screen of a specific product
  const handleProductPress = (product) => {
    navigation.navigate("productdetail", { product: product });
  };

  //method to add to cart (redux)
  const handleAddToCat = (product) => {
    addCartItem(product);
  };

  var headerOptions = {
    method: "GET",
    redirect: "follow",
  };

  const fetchProduct = async() => {
    fetch(`${network.serverip}/products`, headerOptions) //API call
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setProducts(result.data);
          setProductsOr(result.data);
          setError("");
          let payload = [];
          result.data.forEach((cat, index) => {
            let searchableItem = { ...cat, id: ++index, name: cat.title };
            payload.push(searchableItem);
          });
          setSearchItems(payload);
        } else {
          setError(result.message);
        }
      })
      .catch((error) => {
        setError(error.message);
        console.log("error", error);
      });
  };

  const fetchCategories = async() => {
    var myHeaders = new Headers();

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(`${network.serverip}/categories`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setCategories(result.categories);
          setError("");
        } else {
          setError(result.message);
        }
      })
      .catch((error) => {
        setError(error.message);
        console.log("error", error);
      });
  };

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchProduct();
    setRefreshing(false);
  };

  const caricaTessera = () => {
    setTimeout(function() {
      setLoadImg(false);
    }, 1500); 
  }

  //convert user to json and fetch products in initial render
  useEffect(() => {
    setLoadImg(true);
    convertToJSON(user);
    fetchProduct();
    fetchCategories();
    caricaTessera();
  }, []);

  const filter = () => {
    const keyword = filterItem;
    if (keyword !== "") {
      const results = products.filter((product) => {
        return product?.title.toLowerCase().includes(keyword.toLowerCase());
      });

      setProducts(results);
    } else {
      setProducts(productsOr);
    }
  };

  useEffect(() => {
    filter();
  }, [filterItem]);

    const openLink = (url) => {
      Linking.openURL(url);
    };

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.topBarContainer}>
        <TouchableOpacity>
          {/*<Ionicons name="menu" size={30} color={colors.muted} />*/}
          {/*<Image source={menu} style={{ width: 16, height: 16 }} />*/}
        </TouchableOpacity>
        <View style={styles.topbarlogoContainer}>
          <Image source={servitorilogo2} style={styles.logo} />
        </View>
        <TouchableOpacity
          style={styles.cartIconContainer}
          //onPress={() => navigation.navigate("cart")}
        >
        {/*  {cartproduct.length > 0 ? (
            <View style={styles.cartItemCountContainer}>
              <Text style={styles.cartItemCountText}>{cartproduct.length}</Text>
            </View>
          ) : (
            <></>
          )}
          <Ionicons
            name="cart"
            size={30}
            color={"white"}
          />*/}
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
          {/*<CustomInput
            radius={5}
            placeholder={"Cerca..."}
            value={filterItem}
            setValue={setFilterItem}
          />
        <CustomInput radius={5} placeholder={"Search...."} />*/}
          </View>
          {/*<View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.scanButton}>
              <Text style={styles.scanButtonText}>Scan</Text>
              <Image source={scanIcon} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
      </View>*/}
        </View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              style={styles.flatListContainer2}
              horizontal={true}
              data={categories.length > 0 && categories}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item, index }) => (
                <View style={{ marginBottom: 10 }} key={index}>
                  <CustomIconButton
                    key={index}
                    text={item.title}
                    image={item.image}
                    style={{borderRadius: 20}}
                    onPress={() =>
                      navigation.jumpTo("categories", { categoryID: item })
                    }
                  />
                </View>
              )}
            />
        <ScrollView nestedScrollEnabled={true}>
            <View style={styles.promotiomSliderContainer}>
              {/*<SliderBox    
              images={slides}
              sliderBoxHeight={190}
              dotColor={colors.primary}
              inactiveDotColor={colors.muted}
              paginationBoxVerticalPadding={10}
              autoplayInterval={6000}
              ImageComponentStyle={{ borderRadius: 20, width: 350 }}
                  />*/}  
                <ImageBackground source={tesserafronte} style={styles.face}> 
                <FlipCard 
                  style={styles.card}
                  friction={6}
                  perspective={1000}
                  flipHorizontal={true}
                  flipVertical={false}
                  flip={false}
                  clickable={true}
                  //onFlipEnd={(isFlipEnd)=>{console.log('isFlipEnd', isFlipEnd)}}
                >
                    <View style={styles.tesseraContent}>
                      <Text style={styles.textTessera}>Tessera N°: {numeroTessera}</Text>
                      <Text style={styles.textTessera}>Scadenza: {formattedDate}</Text>
                    </View> 
                    <View style={styles.tesseraContent}>
                      <Text style={styles.textTessera}>Valida per {name}</Text>
                    </View>                   
                </FlipCard>
                </ImageBackground>
              </View>
          {/*<View style={styles.primaryTextContainer}>
            <Text style={styles.primaryText}>In promozione</Text>
            </View>*/}
          <View style={styles.primaryTextContainer}>
            <Text style={styles.primaryText}>Prossimi appuntamenti</Text>
          </View>
          {products.length === 0 ? (
            <View style={styles.productCardContainerEmpty}>
              <Text style={styles.productCardContainerEmptyText}>
                Nessun evento
              </Text>
            </View>
          ) : (
            <View style={styles.productCardContainer}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refeshing}
                    onRefresh={handleOnRefresh}
                  />
                }
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
                horizontal={true}
                data={products.slice(0, 4)}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                  <View
                    key={item._id}
                    style={{ marginLeft: 5, marginBottom: 10, marginRight: 5 }}
                  >
                    <ProductCard
                      name={item.title}
                      image={`${network.serverip}/uploads/${item.image}`}
                      price={item.price}
                      quantity={item.quantity}
                      description={item.description}
                      onPress={() => handleProductPress(item)}
                      onPressSecondary={() => handleAddToCat(item)}
                    />
                  </View>
                )}
              />
              <View style={styles.emptyView}></View>
            </View>
          )}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 40, }}>
              <TouchableOpacity onPress={() => openLink('https://www.facebook.com/iservitoridellarte/')}>
                <Ionicons name="logo-facebook" size={35} color="blue" style={{ marginRight: 20 }} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openLink('https://www.instagram.com/iservitoridellarte/')}>
                <Ionicons name="logo-instagram" size={35} color="purple" style={{ marginRight: 20 }} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openLink('https://www.iservitoridellarte.com/')}>
                <Ionicons name="globe-outline" size={35} color="green" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: '#000', //colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.light_red,
    color: 'white',
    paddingTop: 50,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  topbarlogoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 25,
    marginTop: 20,
  },
  card: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  face: {
    height: '100%',
    width: '82%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: '15%',
    flex: 1,
  },
  tesseraContent: {
    //borderWidth: 2, 
    //borderColor: '#D7713C', 
    borderRadius: 5,
    width: 250,
    height: '60%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 40,  
    marginLeft: -25,
  },
  back: {

  },
  bodyContainer: {
    width: "100%",
    flexDirecion: "row",

    paddingBottom: 0,
    flex: 1,
  },
  logoContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  logo: {
    height: 90,
    width: 260,
    resizeMode: "contain",
  },
  secondaryText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  searchContainer: {
    marginTop: 0,
    padding: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: colors.light_red,
    paddingBottom: 55,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  inputContainer: {
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    marginVertical: 0,
  },
  buttonContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 40,
    width: "100%",
  },
  scanButtonText: {
    fontSize: 15,
    color: colors.light,
    fontWeight: "bold",
  },
  primaryTextContainer: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
  primaryText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.light
  },
  flatListContainer: {
    width: "100%",
    height: 50,
    marginTop: 10,
    marginLeft: 10,
  },
  flatListContainer2: {
    width: "99%",
    height: 50,
    marginTop: -30,
    marginBottom: 0,
    marginHorizontal: 10,
    paddingRight: 10,
  },
  promotiomSliderContainer: {
    marginHorizontal: 0,
    marginVertical: 5,
    marginTop: 20,
    height: 210,
    backgroundColor: '#000', //colors.light,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    //marginLeft: 30,
  },
  textTessera: {
    fontSize: 15,
    fontWeight: '500',
    transform: [{ rotate: '-5deg' }],
    marginTop: 20,
  },
  backtextTessera: {
    fontSize: 11,
    marginTop: 13,
  },
  titleTessera: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: -5,
    marginBottom: 5,
    fontWeight: '500',
    transform: [{ rotate: '-5deg' }],
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 60,
    marginLeft: 10,
  },
  emptyView: { width: 30, marginBottom: 30 },
  productCardContainer: {
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 280,
    marginLeft: 10,
    paddingTop: 0,
    marginBottom: 10,
  },
  productCardContainerEmpty: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 240,
    marginLeft: 10,
    paddingTop: 0,
  },
  productCardContainerEmptyText: {
    fontSize: 15,
    fontStyle: "italic",
    color: colors.muted,
    fontWeight: "600",
  },
  cartIconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemCountContainer: {
    position: "absolute",
    zIndex: 10,
    top: -10,
    left: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    width: 22,
    backgroundColor: colors.danger,
    borderRadius: 11,
  },
  cartItemCountText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 10,
  },
});
