import { View, Text, StyleSheet } from "react-native";

export default function IngredientListItem({ item }) {
  const { name, amount, unit, cost_per_kg, expiration_date } = item;
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>
        {name}, {parseFloat(amount)} {unit}
      </Text>
      <Text style={styles.text}>{cost_per_kg} €/kg</Text>
      {expiration_date && <Text style={styles.text}>Expiration date: {new Date(expiration_date).toLocaleDateString()}</Text>}
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
    //fontSize: 14,
  },
  itemContainer: {
    width: "100%",
    height: "100%",
  },
});