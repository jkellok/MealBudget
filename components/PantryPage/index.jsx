import { useCallback, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { StyleSheet, FlatList, Text, View, Dimensions } from "react-native";
import IngredientListItem from "./IngredientListItem";
import ingredientService from "../../services/ingredients";
import { useAuthSession } from "../../hooks/AuthProvider";
import Button from "../Button";

export default function PantryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const { userId } = useAuthSession();

  const getIngredients = useCallback(async () => {
    const ingredients = await ingredientService.getIngredientsByUser(userId.current);
    setIngredients(ingredients);
    setIsFetching(false);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      getIngredients();
      return () => {
        getIngredients();
      };
    }, [getIngredients])
  );

  const handleEmptyList = () => {
    return <Text style={{ alignSelf: "center" }}>No ingredients found!</Text>;
  };

  const onRefresh = () => {
    setIsFetching(true);
    getIngredients();
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItemContainer}>
      <Link
        href={{
          pathname: "pantry/ingredient/[id]",
          params: { id: item.ingredient_id },
        }}>
        <IngredientListItem item={item} />
      </Link>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* change to SectionList later? */}
      <FlatList
        ListEmptyComponent={handleEmptyList}
        showsVerticalScrollIndicator={true}
        data={ingredients}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.ingredient_id}
        renderItem={renderItem}
        onRefresh={onRefresh}
        refreshing={isFetching}
        ItemSeparatorComponent={<View style={styles.separator}></View>}
      />
      <View style={styles.addButtonContainer}>
        <Link
          href={{
            pathname: "pantry/add"
          }}
          asChild
        >
          <Button label="Add an ingredient" theme="primary-icon-wide" icon="add" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    //borderRadius: 10,
    backgroundColor: "#fff",
    flexDirection: "column",
    width: Dimensions.get("window").width * 0.9,
  },
  addButtonContainer: {
    width: Dimensions.get("window").width * 0.95,
    alignItems: "center"
  },
  errorText: {
    color: "red"
  },
  separator: {
    height: 1,
    backgroundColor: "gray",
  },
  listItemContainer: {
    paddingVertical: 2,
    alignItems: "center",
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
  }
});