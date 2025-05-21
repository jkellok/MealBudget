import { StyleSheet, View, Pressable, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { forwardRef } from "react";

const Button = forwardRef(function Button({ label, theme, onPress, icon }, ref) {
  if (theme === "primary") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: "ffd33d", borderRadius: 10 },
        ]}>
        <Pressable
          style={({ pressed }) => [
            styles.button, { backgroundColor: "#fff" },
            pressed ? { backgroundColor: "#d4d4d4" } : {},
          ]}
          onPress={onPress}
          ref={ref}
        >
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
          style={({ pressed }) => [
            styles.button, { backgroundColor: "#fff" },
            pressed ? { backgroundColor: "#d4d4d4" } : {},
          ]}
          onPress={onPress}
          ref={ref}
        >
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
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? { backgroundColor: "#454545" } : {},
          ]}
          onPress={onPress}
          ref={ref}
        >
          <MaterialIcons name={icon} size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  if (theme === "primary-icon-wide") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: "ffd33d", borderRadius: 10, width: "100%" },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.button, { backgroundColor: "#fff" },
            pressed ? { backgroundColor: "#d4d4d4" } : {},
          ]}
          onPress={onPress}
          ref={ref}
          >
          <MaterialIcons name={icon} size={24} color="#25292e" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed ? { backgroundColor: "#454545" } : {},
        ]}
        onPress={onPress}
        ref={ref}
      >
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
});

export default Button;

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
  }
});
