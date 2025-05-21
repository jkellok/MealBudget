import { StyleSheet, TextInput, View, Text, Dimensions, ScrollView } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import recipeService from "../../services/recipes";
import linkedIngredientService from "../../services/linked_ingredients";
import { useAuthSession } from "../../hooks/AuthProvider";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../Button";
import IconButton from "../IconButton";
import ImagePickerComponent from "../ImagePickerComponent";
import { router } from "expo-router";

const schema = yup
  .object({
    title: yup
      .string().required().min(3).max(100),
    description: yup
      .string().min(3).max(300),
    servings: yup
      .number().positive().required(),
    ingredients: yup
      .array().of(
        yup.object().shape({
          amount: yup.number().positive().required(),
          unit: yup.string().required(),
          name: yup.string().required().max(100),
        })
      ).required(),
    instructions: yup
      .array().of(
        yup.string().required().max(200)
      ).min(1),
    category: yup
      .string().min(3).max(50),
    tags: yup
      .array().of(
        yup.string().max(50)
      ),
    difficulty: yup
      .string().min(3).max(20),
    rating: yup
      .number().min(0).max(5),
    minutes_to_make: yup
      .number().positive(),
    notes: yup
      .string().min(3).max(500),
    image: yup
      .string(),
    is_favorite: yup
      .boolean()
  })
  .required();

const EditForm = ({ defaultValues, onSubmit, onCancel, error }) => {
  const [isFavorite, setIsFavorite] = useState(defaultValues.is_favorite);
  const [showImageField, setShowImageField] = useState(false); // defaultValues.image ? true : false
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const [notesHeight, setNotesHeight] = useState(0);
  const [instructionsHeight, setInstructionsHeight] = useState(0);
  const [showOptionalFields, setShowOptionalFields] = useState(true);

  const { control, handleSubmit, formState: { errors, isDirty }, setValue } = useForm({
    // form validation debug
    resolver: async (data, context, options) => {
      console.log("formdata", data);
      console.log(
        "validation result",
        await yupResolver(schema)(data, context, options)
      );
      return yupResolver(schema)(data, context, options);
    },
    //resolver: yupResolver(schema),
    defaultValues: defaultValues
  });

  const { fields: fieldsIngr, append: appendIngr, remove: removeIngr } = useFieldArray({
    name: "ingredients",
    control
  });

  const { fields: fieldsInst, append: appendInst, remove: removeInst } = useFieldArray({
    name: "instructions",
    control
  });

  const { fields: fieldsTags, append: appendTags, remove: removeTags } = useFieldArray({
    name: "tags",
    control
  });

  const onHandleSubmit = async (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  const onChangeCheckbox = (field, value) => {
    if (field === "is_favorite") setIsFavorite(value);
    setValue(field, value, {
      shouldDirty: true
    });
  };

  const handleSelectedImage = (imageUri) => {
    setValue("image", imageUri, {
      shouldDirty: true
    });
  };

  const handleShowField = (boolean) => {
    setShowImageField(boolean);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.formContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.groupedInputContainer}>
            <View>
              <Text>Title*</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Title*"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.textInput, { width: Dimensions.get("window").width * 0.6 }]}
                    //autoFocus
                    maxLength={100}
                  />
                )}
                name="title"
                defaultValue={defaultValues.title}
              />
            </View>

            <View>
              <Text>Servings</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Servings*"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.textInput, { width: Dimensions.get("window").width * 0.15 }]}
                    keyboardType="numeric"
                  />
                )}
                name="servings"
                defaultValue={defaultValues.servings}
              />
            </View>
          </View>
          {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
          {errors.servings && <Text style={styles.errorText}>{errors.servings.message}</Text>}

          <Text>Ingredients* (amount, unit, name)</Text>
          {fieldsIngr.map((field, index) => {
            return (
            <View key={field.id}>
              <View style={styles.fieldArrayContainer}>
                <Controller
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value.toString()}
                      style={[styles.textInput, { width: 50}]}
                      placeholder="Amount"
                      keyboardType="numeric"
                    />
                  )}
                  name={`ingredients.${index}.amount`}
                  control={control}
                />
                <Controller
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        mode="dropdown"
                      >
                        <Picker.Item label="kg" value="kg" />
                        <Picker.Item label="g" value="g" />
                        <Picker.Item label="l" value="l" />
                        <Picker.Item label="ml" value="ml" />
                        <Picker.Item label="tbsp" value="tbsp" />
                        <Picker.Item label="tsp" value="tsp" />
                        <Picker.Item label="dl" value="dl" />
                        <Picker.Item label="cup" value="cup" />
                        <Picker.Item label="cl" value="cl" />
                        <Picker.Item label="lbs" value="lbs" />
                        <Picker.Item label="oz" value="oz" />
                        <Picker.Item label="fl oz" value="fl oz" />
                        <Picker.Item label="pcs" value="pcs" />
                      </Picker>
                    </View>
                  )}
                  name={`ingredients.${index}.unit`}
                  control={control}
                  />
                <Controller
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[styles.textInput, { width: 100 }]}
                      placeholder="Name"
                      autoCapitalize="none"
                      maxLength={100}
                    />
                  )}
                  name={`ingredients.${index}.name`}
                  control={control}
                />
                {index > 0 && (
                  <IconButton icon="delete" onPress={() => removeIngr(index)} />
                )}
              </View>
              {errors.ingredients && <Text style={styles.errorText}>{errors.ingredients[index]?.amount?.message}</Text>}
              {errors.ingredients && <Text style={styles.errorText}>{errors.ingredients[index]?.unit?.message}</Text>}
              {errors.ingredients && <Text style={styles.errorText}>{errors.ingredients[index]?.name?.message}</Text>}
            </View>
          );})}
          <IconButton icon="add" onPress={() => appendIngr({ amount: 0, unit: "kg", name: "" })} />

          <Text>Instructions*</Text>
          {fieldsInst.map((field, index) => {
            return (
              <View key={field.id}>
                <View style={styles.fieldArrayContainer}>
                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={[styles.textInput, { width: "80%", height: Math.max(35, instructionsHeight)}]}
                        placeholder="Instructions"
                        maxLength={200}
                        multiline
                        onContentSizeChange={(e) =>
                          setInstructionsHeight(e.nativeEvent.contentSize.instructionsHeight)
                        }
                      />
                    )}
                    name={`instructions.${index}`}
                    control={control}
                  />
                  {index > 0 && (
                    <IconButton icon="delete" onPress={() => removeInst(index)} />
                  )}
                </View>
                {errors.instructions && <Text style={styles.errorText}>{errors.instructions[index]?.message}</Text>}
              </View>
            );
          })}
          {errors.instructions && <Text style={styles.errorText}>{errors.instructions.message}</Text>}
          <IconButton icon="add" onPress={() => appendInst("")} />

          <View style={styles.showButtonContainer}>
            <IconButton icon={!showOptionalFields ? "expand-more" : "expand-less"} onPress={() => setShowOptionalFields(!showOptionalFields)} />
          </View>
          {showOptionalFields && (
            <View>
              <Text>Description</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Description"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.textInput, { height: Math.max(35, descriptionHeight)}]}
                    maxLength={300}
                    multiline
                    onContentSizeChange={(e) =>
                      setDescriptionHeight(e.nativeEvent.contentSize.descriptionHeight)
                    }
                  />
                )}
                name="description"
                //defaultValue={defaultValues.description}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

              <Text>Category</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Category"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.textInput}
                    autoCapitalize="none"
                    maxLength={50}
                  />
                )}
                name="category"
                defaultValue={defaultValues.category}
              />
              {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>}

              <Text>Tags</Text>
              {fieldsTags.map((field, index) => {
                return (
                  <View key={field.id}>
                    <View style={styles.fieldArrayContainer}>
                      <Controller
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={[styles.textInput, { width: 200 }]}
                            placeholder="Tags"
                            autoCapitalize="none"
                            maxLength={50}
                          />
                        )}
                        name={`tags.${index}`}
                        control={control}
                        defaultValue={defaultValues.tags[index]}
                      />
                      {index > 0 && (
                        <IconButton icon="delete" onPress={() => removeTags(index)} />
                      )}
                    </View>
                    {errors.tags && <Text style={styles.errorText}>{errors.tags[index]?.message}</Text>}
                  </View>
                );
              })}
              {errors.tags && <Text style={styles.errorText}>{errors.tags.message}</Text>}
              <IconButton icon="add" onPress={() => appendTags("")} />

              <View style={styles.groupedInputContainer}>
                <View>
                  <Text>Difficulty</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <View style={[styles.pickerContainer, { width: 182 }]}>
                        <Picker
                          selectedValue={value}
                          onValueChange={onChange}
                          mode="dropdown"
                        >
                          <Picker.Item label="..." value={null} />
                          <Picker.Item label="easy" value="easy" />
                          <Picker.Item label="intermediate" value="intermediate" />
                          <Picker.Item label="hard" value="hard" />
                        </Picker>
                      </View>
                    )}
                    name="difficulty"
                    defaultValue={defaultValues.difficulty}
                  />
                </View>

                <View>
                  {/* Could have options like under 15, 15-30, 30-45, 45-60, over 60, over 2h, multiple hours */}
                  <Text>Minutes to make</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Minutes to make"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={[styles.textInput, { width: 60 }]}
                        keyboardType="numeric"
                      />
                    )}
                    name="minutes_to_make"
                    defaultValue={defaultValues.minutes_to_make}
                  />
                </View>
              </View>
              {errors.difficulty && <Text style={styles.errorText}>{errors.difficulty.message}</Text>}
              {errors.minutes_to_make && <Text style={styles.errorText}>{errors.minutes_to_make.message}</Text>}

              <Text>Notes</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Notes"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.textInput, { height: Math.max(35, notesHeight)}]}
                    maxLength={500}
                    multiline
                    onContentSizeChange={(e) =>
                      setNotesHeight(e.nativeEvent.contentSize.notesHeight)
                    }
                  />
                )}
                name="notes"
                defaultValue={defaultValues.notes}
              />
              {errors.notes && <Text style={styles.errorText}>{errors.notes.message}</Text>}

              <Text>Image</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.imageFieldContainer}>
                    {showImageField && (
                      <TextInput
                        placeholder="Paste image URI here"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={[styles.textInput, { width: 250 }]}
                        autoCapitalize="none"
                      />
                    )}
                    <ImagePickerComponent handleSelectedImage={handleSelectedImage} showField={handleShowField} defaultImage={defaultValues.image} />
                  </View>
                )}
                name="image"
                defaultValue={defaultValues.image}
              />
              {errors.image && <Text style={styles.errorText}>{errors.image.message}</Text>}

              <View style={styles.groupedInputContainer}>
                <View>
                  <Text>Rating</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <View style={[styles.pickerContainer, { width: 100 }]}>
                        <Picker
                          selectedValue={value}
                          onValueChange={onChange}
                          mode="dropdown"
                        >
                          <Picker.Item label="..." value={null} />
                          <Picker.Item label="0" value={0} />
                          <Picker.Item label="1" value={1} />
                          <Picker.Item label="2" value={2} />
                          <Picker.Item label="3" value={3} />
                          <Picker.Item label="4" value={4} />
                          <Picker.Item label="5" value={5} />
                        </Picker>
                      </View>
                    )}
                    name="rating"
                    defaultValue={defaultValues.rating}
                  />
                </View>

                <View>
                  <Text>Is Favorite</Text>
                  <Controller
                    control={control}
                    render={({ field: { onBlur, name } }) => (
                      <View style={styles.checkboxContainer}>
                        <Checkbox
                          onValueChange={(value) => onChangeCheckbox(name, value)}
                          onBlur={onBlur}
                          value={isFavorite}
                        />
                      </View>
                    )}
                    name="is_favorite"
                    defaultValue={defaultValues.is_favorite}
                  />
                </View>
              </View>
              {errors.rating && <Text style={styles.errorText}>{errors.rating.message}</Text>}
              {errors.is_favorite && <Text style={styles.errorText}>{errors.is_favorite.message}</Text>}
            </View>
          )}

        </View>
      </ScrollView>
      <View style={{ alignItems: "center" }}>
        {isDirty && <Text style={styles.errorText}>Unsaved changes!</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <Button label="Cancel" onPress={handleCancel} />
        <Button label="Update" theme="primary" onPress={handleSubmit(onHandleSubmit)} />
      </View>
    </>
  );
};

export default function EditRecipeForm() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState([]);
  const { userId } = useAuthSession();
  const [error, setError] = useState(null);
  const [linkedIngredients, setLinkedIngredients] = useState([]);

  const getRecipe = useCallback(async (id) => {
    const recipe = await recipeService.getRecipe(id, userId.current);
    setRecipe(recipe);
  }, [userId]);

  const getLinkedIngredients = async (id) => {
    const linkedIngredients = await linkedIngredientService.getLinkedIngredientsByRecipe(id);
    setLinkedIngredients(linkedIngredients);
  };

  useEffect(() => {
    getRecipe(id);
    getLinkedIngredients(id);
  }, [id, getRecipe]);

  if (recipe.length === 0) return null;

  const defaultValues = {
    title: recipe.title,
    description: recipe.description ? recipe.description : undefined,
    servings: recipe.servings ? recipe.servings.toString() : undefined,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    category: recipe.category ? recipe.category : undefined,
    tags: recipe.tags ? recipe.tags : undefined,
    difficulty: recipe.difficulty ? recipe.difficulty : undefined,
    rating: recipe.rating ? recipe.rating : undefined,
    minutes_to_make: recipe.minutes_to_make ? recipe.minutes_to_make.toString() : undefined,
    notes: recipe.notes ? recipe.notes : undefined,
    image: recipe.image ? recipe.image : undefined,
    is_favorite: recipe.is_favorite
  };

  const onSubmit = async (values) => {
    try {
      const updatedRecipe = await recipeService.updateRecipe(values, recipe.recipe_id, userId.current);
      // could compare objects here, if ingredients are the same, update linked ingredients
      await updateLinkedIngredients(values.ingredients);
      console.log("recipe submitted", updatedRecipe);
      router.dismiss();
    } catch (err) {
      console.error(err);
      setError("Error editing the recipe");
    }
  };

  const updateLinkedIngredients = async (editedIngredients) => {
    const currIngredients = recipe.ingredients;
    // compare new ingredient values with existing ingredients in the recipe
    // if they are different, something has changed
    // if the ingredient is linked, it needs to be updated

    // move to helper function file?
    const isSame = (a, b) => a.amount === b.amount && a.unit === b.unit && a.name === b.name;
    const onlyInLeft = (left, right, compareFunction) =>
      left.filter(leftValue =>
        !right.some(rightValue =>
          compareFunction(leftValue, rightValue)
        )
      );
    // contains new edited ingredients, will not contain removed ingredients
    const onlyInEdited = onlyInLeft(editedIngredients, currIngredients, isSame);
    // contains old ingredients before submission, can contain ingredients that are to be removed
    const onlyInCurr = onlyInLeft(currIngredients, editedIngredients, isSame);

    // update each edited linked ingredient that are in onlyInEdited
    for (let i = 0; i < onlyInEdited.length; i++) {
      const linkedIngredientToUpdate = linkedIngredients.find(l => l.name === onlyInEdited[i].name);
      if (linkedIngredientToUpdate) {
        await linkedIngredientService.updateLinkedIngredient(recipe.recipe_id, onlyInEdited[i]);
      }
    }

    // if a linked ingredient is deleted, onlyInEdited does not have the object while the object is in onlyInCurr
    // if a linked ingredient is edited, it is in both arrays
    // create a new array that contains the objects to be deleted
    const linkedIngredientsToDelete = onlyInCurr.filter(({ name }) => !onlyInEdited.some((e) => e.name === name));

    // get ingredient_id from linkedIngredients and unlink it
    for (let i = 0; i < linkedIngredientsToDelete.length; i++) {
      const linkedIngredientToDelete = linkedIngredients.find(l => l.name === linkedIngredientsToDelete[i].name);
      if (linkedIngredientToDelete) {
        await linkedIngredientService.deleteLinkedIngredient(recipe.recipe_id, linkedIngredientToDelete.ingredient_id);
      }
    }
  };

  const onCancel = () => {
    router.dismiss();
  };

  return (
    <View style={styles.container}>
      <EditForm defaultValues={defaultValues} recipe={recipe} userId={userId} linkedIngredients={linkedIngredients} onSubmit={onSubmit} onCancel={onCancel} error={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
    borderRadius: 18,
    alignSelf: "center",
    justifyContent: "center",
    paddingBottom: 8,
    marginVertical: 10,
  },
  scroll: {
  },
  formContainer: {
    padding: 10,
    width: Dimensions.get("window").width * 0.9,
  },
  textInput: {
    backgroundColor: "#fff",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  errorText: {
    color: "red"
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 3
  },
  fieldArrayContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  imageFieldContainer: {
    //flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    height: 40,
    alignContent: "center",
  },
  pickerContainer: {
    width: 110,
    backgroundColor: "#fff",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    borderRadius: 6,
    justifyContent: "center",
  },
  pickerItem: {
    fontSize: 14,
  },
  groupedInputContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 1
  },
  checkboxContainer: {
    //alignItems: "center",
    justifyContent: "center",
    height: 40
  },
  showButtonContainer: {
    alignItems: "center",
  }
});