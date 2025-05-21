import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import RatingBar from "../RatingBar";

const placeholderImage = require("../../assets/images/fork-and-knife-with-plate.png");

export default function RecipeListItem({ item }) {
  const { title, servings, image, total_cost, cost_per_serving, rating, is_favorite } = item;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.outerRowContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            placeholder={placeholderImage}
            placeholderContentFit="fill"
            source={image}
            contentFit="cover"
            transition={1000}
          />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {title}
            </Text>
            {is_favorite && <MaterialIcons name="favorite" size={16} color="red" style={{ paddingLeft: 6 }} />}
          </View>
          {rating && <RatingBar rating={rating} size={16} />}
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
  },
  itemContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  outerRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    gap: 8,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: "#0553",
  },
  textContainer: {
    flex: 1,
    height: "100%"
  },
  imageContainer: {
    backgroundColor: "blue",
  },
  titleContainer: {
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "center",
    flexWrap: "wrap",
  },
});