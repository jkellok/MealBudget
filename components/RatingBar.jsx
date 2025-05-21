import { View, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// star, star-outline, star-half

export default function RatingBar({ rating, size }) {
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        {Array.from({ length: rating }, (_, index) => (
          <MaterialIcons name="star" size={size} color="#e4b700" key={index} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "#6b6b6b",
    //borderRadius: 8
  },
  rowContainer: {
    flexDirection: "row",
  },
});