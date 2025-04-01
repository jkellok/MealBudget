import { View, Text, StyleSheet } from "react-native";

export default function IngredientListItem({ item }) {
  const { name, amount, unit, price_per_kg } = item;
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>
        {name}
      </Text>
      <Text style={styles.text}>{parseFloat(amount)} {unit}</Text>
      <Text style={styles.text}>{price_per_kg} €/kg</Text>
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
});