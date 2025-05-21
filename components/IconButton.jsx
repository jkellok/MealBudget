import { Pressable, StyleSheet, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function IconButton({ icon, onPress }) {
  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.iconButton,
          pressed ? { backgroundColor: "#d4d4d4" } : {},
        ]}
        onPress={onPress}
      >
        <MaterialIcons name={icon} size={20} color={"#000"} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 34,
    height: 34,
    marginHorizontal: 5,
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  iconButtonLabel: {
    color: "#000",
    marginTop: 12,
  },
  iconButtonContainer: {
    width: 34,
    height: 34,
    marginHorizontal: 5,
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 20,
    backgroundColor: "#fff",
    alignContent: "center",
    justifyContent: "center",
  },
});