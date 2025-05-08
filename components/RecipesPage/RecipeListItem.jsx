import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const placeholderImage = require("../../assets/images/fork-and-knife-with-plate.png");

export default function RecipeListItem({ item }) {
  const { title, servings, image, total_cost, cost_per_serving } = item;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.rowContainer}>
        <Image
          style={styles.image}
          placeholder={placeholderImage}
          placeholderContentFit="cover"
          source={image}
          contentFit="cover"
          transition={1000}
        />
        <View>
          <Text style={styles.title}>
            {title}
          </Text>
          <View style={styles.rowContainer}>
            <View style={styles.rowContainer}>
              <MaterialIcons name="person" size={16} color="black" />
              <Text> {servings}</Text>
            </View>
            {total_cost && (
            <View style={styles.rowContainer}>
              <FontAwesome5 name="coins" size={16} color="black" />
              <Text> {total_cost} € ({cost_per_serving} €)</Text>
            </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    alignSelf: "center",
  },
  text: {
    alignSelf: "center",
  },
  itemContainer: {
    //width: "100%",
    //flex: 0,
    //backgroundColor: "red"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: "#0553",
    marginRight: 6
  }
});