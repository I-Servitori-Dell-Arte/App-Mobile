import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants";

const UserList = ({ username, email, onPress, partecipazione, tesseraGratis, scontoGratis }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.profileContainer}>
        <Ionicons
          name="person-circle-outline"
          size={40}
          color={colors.primary_light}
        />
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.usernameText}>{username}</Text>
        <Text style={styles.userEmailText}>{email}</Text>
        <Text style={styles.userEmailText}>Partecipazioni: {partecipazione}</Text>
        <Text style={styles.userEmailText}>Tessera Gratuita: {tesseraGratis}</Text>
        <Text style={styles.userEmailText}>Sconto Gratuito: {scontoGratis}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.white,
    height: 'auto',
    borderRadius: 10,
    elevation: 2,
    marginLeft: 10,
    marginRight: 10,
    margin: 5,
    paddingVertical: 10,
  },
  profileContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  userEmailText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
  },
  userInfoContainer: {
    marginLeft: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
