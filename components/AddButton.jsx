import { View, Pressable, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function AddButton({ onPress }) {
  return (
    <View style={styles.addButtonContainer}>
      <Pressable style={styles.addButton} onPress={onPress}>
        <MaterialIcons name="add" size={38} color="#25292e" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 60,
    borderWidth: 4,
    borderColor: "#ffd33d",
    borderRadius: 42,
    padding: 3,
  },
  addButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
    backgroundColor: "#fff",
  },
});