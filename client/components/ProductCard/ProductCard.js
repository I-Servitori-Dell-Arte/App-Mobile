import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

const ProductCard = ({
  name,
  price,
  image,
  quantity,
  onPress,
  onPressSecondary,
  cardSize,
  description,
  date= '10 Agosto'
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { width: cardSize === "large" ? "100%" : 150 }]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.productImage} />
      </View>
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.secondaryTextSm}>{`${name?.substring(
            0,
            11
          )}..`}</Text>
          <Text style={styles.descText}>{`${description?.substring(
            0,
            50
          )}..`}</Text>
        </View>
{/*        <View>
          {quantity > 0 ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={onPressSecondary}
            >
              <Ionicons name="cart" size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.iconContainerDisable} disabled>
              <Ionicons name="cart" size={20} color="white" />
            </TouchableOpacity>
          )}
          </View>*/}
      </View>
      <Text style={styles.date}>{date}</Text>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: 250,
    height: 250,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
    elevation: 5,
  },
  imageContainer: {
    backgroundColor: colors.light,
    width: "100%",
    height: 130,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 2,
    position: 'relative',
    paddingBottom: 0,
  },
  date: {
    width: '90%',
    borderRadius: 2,
    backgroundColor: colors.muted,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    zIndex: 10,
    fontSize: 12,
    position: 'absolute',
    bottom: 10,
  },
  productImage: {
    height: 130,
    width: '100%',
    borderRadius: 5,
  },
  infoContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  secondaryTextSm: {
    fontSize: 15,
    fontWeight: "bold",
  },
  descText: {
    fontSize: 12,
  },
  primaryTextSm: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
  },
  iconContainer: {
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 5,
    display: "flex",

    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerDisable: {
    backgroundColor: colors.muted,
    width: 30,
    height: 30,
    borderRadius: 5,
    display: "flex",

    justifyContent: "center",
    alignItems: "center",
  },
});
