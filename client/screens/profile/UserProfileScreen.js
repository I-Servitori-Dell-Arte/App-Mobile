import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking
} from "react-native";
import React, { useEffect, useState } from "react";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import { Ionicons } from "@expo/vector-icons";
import OptionList from "../../components/OptionList/OptionList";
import { colors } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ob from '../../assets/ob.png';
import ob1 from '../../assets/ob1.png';
import * as Progress from 'react-native-progress';

const UserProfileScreen = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState({});
  const { user } = route.params;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      id: user._id,
    }),
    redirect: "follow",
  };

  const completionPercentage = user.partecipazione5 && user.partecipazione5 >= 6 ? 5 / 5 : user.partecipazione5 / 5;
  const completionPercentage3 = user.partecipazione && user.partecipazione >= 4 ? 3 / 3 : user.partecipazione / 3;

  console.log(user.partecipazione, user.partecipazione5);
  const convertToJSON = (obj) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };

  // covert  the user to Json object on initial render
  useEffect(() => {
    convertToJSON(user);
  }, []);

  const handleOttieniTessera = () => {
    fetch(network.serverip + "/ottieni-tessera", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success === true) {
        console.log("Tesseraa Ottenuta", result.data);
        setUserInfo(result.data);
      } else {
        console.log("Errore durante la creazione della tessera", result.message);
      }
    })
    .catch((error) => {
      console.log("Errore:", error);
      
    });
  }

  const handleOttieniSconto = () => {
    fetch(network.serverip + "/ottieni-sconto", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success === true) {
        console.log("Sconto ottenuto", result.data);
        setUserInfo(result.data);
      } else {
        console.log("Errore durante la creazione della tessera", result.message);
      }
    })
    .catch((error) => {
      console.log("Errore:", error);
    });
  }

  let progressImages = [];
  for (let i = 0; i < 3; i++) {
    if (i < user.partecipazione) {
      progressImages.push(<Image key={i} source={ob} style={styles.imageok} />);
    } else {
      progressImages.push(<Image key={i} source={ob1} style={styles.image} />);
    }
  }

  let progressImages5 = [];
  for (let i = 0; i < 5; i++) {
    if (i < user.partecipazione5) {
      progressImages5.push(<Image key={i} source={ob} style={styles.image5ok} />);
    } else {
      progressImages5.push(<Image key={i} source={ob1} style={styles.image5} />);
    }
  }

  const openEmailApp = () => {
    const email = "info@iservitoridellarte.com";
    const subject = encodeURIComponent("Richiesta di assistenza");
    const body = encodeURIComponent("Scrivi qui la richiesta...");

    const url = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.canOpenURL(url)
    .then((supported) => {
        if (!supported) {
            console.log("Non posso gestire l'url: " + url);
        } else {
            return Linking.openURL(url);
        }
    })
    .catch((err) => console.error('Si è verificato un errore:', err));
};
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity>
          {/*<Ionicons name="menu-sharp" size={30} color={colors.primary} />*/}
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Profile</Text>
      </View>
      <View style={styles.UserProfileCardContianer}>
        <UserProfileCard
          Icon={Ionicons}
          name={userInfo?.name}
          email={userInfo?.email}
        />
      </View>
      <View style={styles.obiettivi}>
        <View style={styles.obItem}>
          <Text style={{color: 'black', fontWeight: 500}}>Punti sconto: {user.partecipazione && user.partecipazione >= 4 ? 3 : user.partecipazione}/3</Text>
          <Text style={{color: 'black'}}>sconto di 10€ se porti un amico</Text>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10,}}>
           {progressImages.length > 0 && progressImages} 
          </View>
          
          {user.partecipazione && user.partecipazione >= 3 ? (
            <TouchableOpacity onPress={handleOttieniTessera} style={styles.ottieni}>
              <Text style={{color: colors.light_black, fontWeight: '500'}}>Ottieni Tessera</Text>
            </TouchableOpacity>  
          ) : null}
        </View>
        <View style={styles.obItem}>
          <Text style={{color: 'black', fontWeight: 500}}>Punti gratuità: {user.partecipazione5 && user.partecipazione5 >= 6 ? 5 : user.partecipazione5}/5</Text>
          <Text style={{color: 'black'}}>sul prossimo tour</Text>
         {/* <Progress.Bar
          progress={completionPercentage && completionPercentage} 
          //width={100}
          color="#fff"
          style={{ marginVertical: 10, width: '100%' }} />*/}
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10,}}>
           {progressImages5.length > 0 && progressImages5} 
          </View>
          {user.partecipazione5 && user.partecipazione5 >= 5 ? (
            <TouchableOpacity onPress={handleOttieniSconto} style={styles.ottieni}>
              <Text style={{color: colors.light_black, fontWeight: '500'}}>Ottieni Sconto</Text>
          </TouchableOpacity> 
          ): null}
        </View>
      </View>

      <View style={styles.OptionsContainer}>
        <OptionList
          text={"Account"}
          Icon={Ionicons}
          iconName={"person"}
          onPress={() => navigation.navigate("myaccount", { user: userInfo })}
        />
        <OptionList
          text={"Preferiti"}
          Icon={Ionicons}
          iconName={"heart"}
          onPress={() => navigation.navigate("mywishlist", { user: userInfo })}
        />
        <OptionList
          text={"Assistenza"}
          Icon={Ionicons}
          iconName={"help"}
          onPress={openEmailApp}
        />
        {/* !For future use --- */}
        {/* <OptionList
          text={"Settings"}
          Icon={Ionicons}
          iconName={"settings-sharp"}
          onPress={() => console.log("working....")}
        />
        <OptionList
          text={"Help Center"}
          Icon={Ionicons}
          iconName={"help-circle"}
          onPress={() => console.log("working....")}
        /> */}
        {/* !For future use ---- End */}
        <OptionList
          text={"Esci"}
          Icon={Ionicons}
          iconName={"log-out"}
          onPress={async () => {
            await AsyncStorage.removeItem("authUser");
            navigation.replace("login");
          }}
        />
      </View>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    flex: 1,
    paddingTop: 40,
  },
  image: {
    width: 35,
    height: 35,
    marginHorizontal: 5,
  },
  image5: {
    width: 23,
    height: 23,
    marginHorizontal: 2,
  },
  image5ok: {
    width: 28,
    height: 28,
    marginHorizontal: 2,
  },
  imageok: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  obiettivi: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  obItem: {
    width: '45%',
    minHeight: 117,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  UserProfileCardContianer: {
    width: "100%",
    height: "22%",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  OptionsContainer: {
    width: "100%",
  },
  ottieni: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.light,
    borderColor: colors.light_black,
    borderWidth: 2,
    marginTop: 10,
  },
});
