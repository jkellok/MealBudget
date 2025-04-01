import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

const placeholderImage = require("../../assets/images/fork-and-knife-with-plate.png");

export default function RecipeListItem({ item }) {
  const { title, servings } = item;
  return (
    <View style={styles.itemContainer}>
      <View style={{ flexDirection: "row" }}>
        <Image
          style={styles.image}
          placeholder={placeholderImage}
          placeholderContentFit="cover"
          source={null} // change later
          contentFit="cover"
          transition={1000}
        />
        <View>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text>Servings: {servings}</Text>
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
  image: {
    width: 50,
    height: 50,
    backgroundColor: "#0553",
    marginRight: 6
  }
});