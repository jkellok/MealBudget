import { StyleSheet, TextInput, View, Text } from "react-native";
import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../Button";
import IconButton from "../IconButton";
import ImagePickerComponent from "../ImagePickerComponent";

const schema = yup
  .object({
    title: yup
      .string().required().min(3).max(199),
    description: yup
      .string().min(3),
    servings: yup
      .number().positive().required(),
    ingredients: yup
      .array().of(
        yup.object().shape({
          amount: yup.number().positive().required(),
          unit: yup.string().required(),
          name: yup.string().required(),
        })
      ).required(),
    instructions: yup
      .array().of(
        yup.string().required()
      ).min(1),
    category: yup
      .string().min(3),
    tags: yup
      .array().of(
        yup.string()
      ),
    difficulty: yup
      .string().min(3),
    rating: yup
      .number().min(0).max(5),
    minutes_to_make: yup
      .number().positive(),
    notes: yup
      .string().min(3),
    image: yup
      .string(),
    is_favorite: yup
      .boolean().default(false)
  })
  .required();

const defaultValues = {
  title: "",
  servings: 0,
  ingredients: [{
    amount: 0,
    unit: "kg",
    name: ""
  }],
  instructions: [], // change to [{ value: "" }] ?
};

export default function AddRecipeForm({ onClose, onSubmit }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showImageField, setShowImageField] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
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

  const onHandleSubmit = (data) => {
    // if using value for instructions, desctructure into array
    console.log("Submitting:", data);
    onSubmit(data);
  };

  const onChangeCheckbox = (field, value) => {
    if (field === "is_favorite") setIsFavorite(value);
    setValue(field, value);
  };

  const handleSelectedImage = (imageUri) => {
    setValue("image", imageUri);
  };

  const handleShowField = (boolean) => {
    setShowImageField(boolean);
  };

  return (
    <View>
      <View style={styles.formContainer}>
        <Text>Title</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Title*"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              autoFocus
            />
          )}
          name="title"
        />
        {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

        <Text>Description</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
            />
          )}
          name="description"
        />
        {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

        <Text>Servings</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Servings*"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              keyboardType="numeric"
            />
          )}
          name="servings"
        />
        {errors.servings && <Text style={styles.errorText}>{errors.servings.message}</Text>}

        <Text>Ingredients</Text>
        {fieldsIngr.map((field, index) => (
          <View key={field.id}>
            <View style={styles.fieldArrayContainer}>
              <Controller
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.textInput}
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
                    style={styles.textInput}
                    placeholder="Name"
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
        ))}
        <IconButton icon="add" onPress={() => appendIngr({ amount: 0, unit: "kg", name: "" })} />

        <Text>Instructions</Text>
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
                      style={styles.textInput}
                      placeholder="Instructions"
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
            />
          )}
          name="category"
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
                      style={styles.textInput}
                      placeholder="Tags"
                    />
                  )}
                  name={`tags.${index}`}
                  control={control}
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

        {/* Options easy, intermediate, hard? */}
        <Text>Difficulty</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Difficulty"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
            />
          )}
          name="difficulty"
        />
        {errors.difficulty && <Text style={styles.errorText}>{errors.difficulty.message}</Text>}

        {/* Options 0-5 or 1-5 */}
        <Text>Rating</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Rating"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              keyboardType="numeric"
            />
          )}
          name="rating"
        />
        {errors.rating && <Text style={styles.errorText}>{errors.rating.message}</Text>}

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
              style={styles.textInput}
              keyboardType="numeric"
            />
          )}
          name="minutes_to_make"
        />
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
              style={styles.textInput}
            />
          )}
          name="notes"
        />
        {errors.notes && <Text style={styles.errorText}>{errors.notes.message}</Text>}

        {/* Upload image from phone (or possibly from internet) */}
        <Text>Image</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.imageFieldContainer}>
              <ImagePickerComponent handleSelectedImage={handleSelectedImage} showField={handleShowField} />
              {showImageField && (
                <TextInput
                  placeholder="Paste image URI here"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.textInput}
                />
              )}
            </View>
          )}
          name="image"
        />
        {errors.image && <Text style={styles.errorText}>{errors.image.message}</Text>}

        <Text>Is Favorite</Text>
        <Controller
          control={control}
          render={({ field: { onBlur, name } }) => (
            <Checkbox
              style={styles.checkbox}
              onValueChange={(value) => onChangeCheckbox(name, value)}
              onBlur={onBlur}
              value={isFavorite}
            />
          )}
          name="is_favorite"
          defaultValue={defaultValues.is_favorite}
        />
        {errors.is_favorite && <Text style={styles.errorText}>{errors.is_favorite.message}</Text>}

      </View>
      <View style={styles.buttonContainer}>
        <Button label="Cancel" onPress={onClose} />
        <Button label="Add" theme="primary-icon" onPress={handleSubmit(onHandleSubmit)} icon="add" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 10,
  },
  textInput: {
    backgroundColor: "#fff",
    height: 40,
    //width: 150,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  errorText: {
    color: "red"
  },
  submitButton: {
    backgroundColor: "lightgreen",
    borderRadius: 5,
    marginTop: 30,
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10
  },
  pickerContainer: {
    width: 120,
    backgroundColor: "#fff",
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  fieldArrayContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  imageFieldContainer: {
    //flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    height: 40,
    alignContent: "center",
  },
});