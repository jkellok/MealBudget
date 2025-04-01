import { StyleSheet, TextInput, View, Text } from "react-native";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../Button";
import IconButton from "../IconButton";

const schema = yup
  .object({
    title: yup
      .string().required()
      .min(3)
      .max(199),
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
      ).min(1)
  })
  .required();

export default function EditRecipeForm({ onClose, onSubmit, recipe }) {
  console.log("recipe", recipe);
  const defaultValues = {
    title: recipe.title,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions
  };

  console.log("default values", defaultValues);

  const { control, handleSubmit, formState: { errors } } = useForm({
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

  const onHandleSubmit = (data) => {
    console.log(data);
    onSubmit(data);
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

      </View>
      <View style={styles.buttonContainer}>
        <Button label="Cancel" onPress={onClose} />
        <Button label="Update" theme="primary" onPress={handleSubmit(onHandleSubmit)} />
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
});