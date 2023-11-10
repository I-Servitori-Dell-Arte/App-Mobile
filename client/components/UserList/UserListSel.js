import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants";

const UserListSel = ({ username, email, isSelected, isMultiSelectActive, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        {isMultiSelectActive && (
          <View style={styles.check}>
            {isSelected ? (
              <Text style={{ fontSize: 30, color: 'green', padding: 10 }}>&#10004;</Text> // Segno di spunta se selezionato
            ) : (
              <Text style={{ fontSize: 30, color: 'gray', padding: 10 }}>&#9744;</Text> // Checkbox vuota se non selezionato
            )}
          </View>
        )}
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
            </View>
      </TouchableOpacity>
    );
  };

  export default UserListSel;

  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: colors.white,
      height: 70,
      borderRadius: 10,
      elevation: 2,
      marginLeft: 10,
      marginRight: 10,
      margin: 5,
    },
    check: {
        padding: 3,
        marginHorizontal: 10,
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