import { StyleSheet, View, Pressable, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Button({ label, theme, onPress, icon }) {
  if (theme === "primary") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: "ffd33d", borderRadius: 10 },
        ]}>
        <Pressable
          style={[styles.button, { backgroundColor: "#fff" }]}
          onPress={onPress}>
          <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  if (theme === "primary-icon") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: "ffd33d", borderRadius: 10 },
        ]}>
        <Pressable
          style={[styles.button, { backgroundColor: "#fff" }]}
          onPress={onPress}>
          <MaterialIcons name={icon} size={24} color="#25292e" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  if (theme === "secondary-icon") {
    return (
      <View
        style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={onPress}>
          <MaterialIcons name={icon} size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

// https://docs.expo.dev/tutorial/build-a-screen/
// for different button styles

const styles = StyleSheet.create({
  buttonContainer: {
    width: 130,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#222",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});
