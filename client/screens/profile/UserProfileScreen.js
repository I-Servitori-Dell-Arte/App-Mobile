import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import { Ionicons } from "@expo/vector-icons";
import OptionList from "../../components/OptionList/OptionList";
import { colors } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity>
          <Ionicons name="menu-sharp" size={30} color={colors.primary} />
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
          <Text style={{color: 'white'}}>Partecipazioni per la tessera gratuita: {user.partecipazione && user.partecipazione >= 4 ? 3 : user.partecipazione}/3</Text>
          <Progress.Bar
          progress={completionPercentage3 && completionPercentage3} 
          //width={100}
          color="#fff"
          style={{ marginVertical: 10, width: '100%' }} />
          {user.partecipazione && user.partecipazione >= 3 ? (
            <TouchableOpacity onPress={handleOttieniTessera} style={styles.ottieni}>
              <Text style={{color: colors.light_black, fontWeight: '500'}}>Ottieni Tessera</Text>
            </TouchableOpacity>  
          ) : null}
        </View>
        <View style={styles.obItem}>
          <Text style={{color: 'white'}}>Partecipazioni per lo sconto: {user.partecipazione5 && user.partecipazione5 >= 6 ? 5 : user.partecipazione5}/5</Text>
          <Progress.Bar
          progress={completionPercentage && completionPercentage} 
          //width={100}
          color="#fff"
          style={{ marginVertical: 10, width: '100%' }} />
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
    minHeight: 80,
    backgroundColor: colors.primary,
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
