import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomInput from "../../components/CustomInput/";
import ProgressDialog from "react-native-progress-dialog";
import UserList from "../../components/UserList/UserList";
import UserListSel from "../../components/UserList/UserListSel";

const ViewUsersScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const { authUser } = route.params;
  const [user, setUser] = useState({});
  const [isloading, setIsloading] = useState(false);
  const [refeshing, setRefreshing] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [alert2, setAlert2] = useState("success");
  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [succ, setSucc] = useState("");
  const [users, setUsers] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [filterItem, setFilterItem] = useState("");

  //method to convert the authUser to json object
  const getToken = (obj) => {
    try {
      setUser(JSON.parse(obj));
    } catch (e) {
      setUser(obj);
      return obj.token;
    }
    return JSON.parse(obj).token;
  };

  //method the fetch the users from server using API call
  const fetchUsers = () => {
    var myHeaders = new Headers();
    myHeaders.append("x-auth-token", getToken(authUser));

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    setIsloading(true);
    fetch(`${network.serverip}/admin/users`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setUsers(result.data);
          setFoundItems(result.data);
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

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchUsers();
    setRefreshing(false);
  };

  //method to filer the orders for by title [search bar]
  const filter = () => {
    const keyword = filterItem;
    if (keyword !== "") {
      const results = users.filter((user) => {
        return user.name.toLowerCase().includes(keyword.toLowerCase());
      });

      setFoundItems(results);
    } else {
      setFoundItems(users);
    }
    setName(keyword);
  };

  //filter the data whenever filteritem value change
  useEffect(() => {
    filter();
  }, [filterItem]);

  //fetch the orders on initial render
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (item) => {
    navigation.navigate("viewuser", {
      user: item,
      Token: authUser,
    });
  };

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);

  const activateMultiSelect = () => {
    setIsMultiSelectActive(!isMultiSelectActive);
  };

  const isUserSelected = (user) => {
    return selectedUsers.some((selectedUser) => selectedUser._id == user._id);
  };

  const handleSel = (user) => {
    if (isMultiSelectActive) {
      const isSelected = isUserSelected(user);

      if (isSelected) {
        setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser._id !== user._id));
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    } else {
      return
    }
  };

  const addPartecipazione = () => {
    console.log(selectedUsers);

      fetch(`${network.serverip}/add-part`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedUsers }),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setSucc("Partecipazione aggiunta");
          setIsMultiSelectActive(false);
          setSelectedUsers([]);
          fetchUsers();
        })
        .catch(error => {
          console.error('Errore durante la richiesta:', error);
          setError("Qualcosa è andato storto")
        });
  }

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
        <TouchableOpacity disabled>
          <AntDesign name="user" size={25} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>Dashboard Utenti</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>Vedi tutti gli utenti</Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <CustomAlert message={succ} type={alert2} />
      <CustomInput
        radius={5}
        placeholder={"Cerca..."}
        value={filterItem}
        setValue={setFilterItem}
      />
      <TouchableOpacity style={styles.selectUser} onPress={activateMultiSelect}>
        <Text style={{color: 'white', fontWeight: '500'}}>{isMultiSelectActive ? 'Annulla' : 'Seleziona'}</Text>
      </TouchableOpacity>  
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
        }
      >
        {foundItems && foundItems.length == 0 ? (
          <Text>{`Nessun utente trovato con il nome ${filterItem}!`}</Text>
        ) : (
          !isMultiSelectActive ?
          foundItems.map((item, index) => (
            <UserList
              key={index}
              username={item?.name}
              email={item?.email}
              usertype={item?.userType}
              onPress={() => handleEdit(item)}
              partecipazione={item?.partecipazione ? item.partecipazione : '0'}
            />
          ))
          :
          foundItems.map((item, index) => (
            <UserListSel 
            key={index}
            username={item?.name}
            email={item?.email}
            usertype={item?.userType}
            onPress={() => handleSel(item)}
            isSelected={isUserSelected(item)} 
            isMultiSelectActive={isMultiSelectActive}
            />
          ))
        )}
      </ScrollView>
      {isMultiSelectActive && (
        <TouchableOpacity style={styles.selectUser} onPress={addPartecipazione}>
          <Text style={{color: 'white', fontWeight: '500'}}>Aggiungi 1 partecipazione</Text>
        </TouchableOpacity>  
      )}
    </View>
  );
};

export default ViewUsersScreen;

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
  selectUser: {
    marginVertical: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10, 
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
    marginBottom: 10,
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
