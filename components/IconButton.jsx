import { Pressable, StyleSheet, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function IconButton({ icon, onPress}) {
  return (
    <View style={styles.IconButtonContainer}>
      <Pressable style={styles.iconButton} onPress={onPress}>
        <MaterialIcons name={icon} size={20} color={"#000"} />
      </Pressable>
    </View>

  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonLabel: {
    color: "#000",
    marginTop: 12,
  },
  IconButtonContainer: {
    width: 34,
    height: 34,
    marginHorizontal: 6,
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 20,
    backgroundColor: "#fff",
    alignContent: "center",
    justifyContent: "center",
  },
});