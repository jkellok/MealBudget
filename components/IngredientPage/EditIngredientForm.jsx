import { StyleSheet, TextInput, View, Text, Pressable } from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../Button";

const schema = yup
  .object({
    name: yup
      .string().required()
      .min(3)
      .max(99),
    amount: yup
      .number().required()
      .min(0),
    unit: yup
      .string().required(),
    pricePerKg: yup
      .number().required()
      .min(0),
    expiresOn: yup
      .date(),
  })
  .required();


export default function EditIngredientForm({ onClose, onSubmit, ingredient }) {
  const defaultValues = {
    name: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit,
    price_per_kg: ingredient.price_per_kg
  };

  console.log("default vlaues", defaultValues);
  console.log("ingr", ingredient);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onHandleSubmit = (data) => {
    console.log(data);
    // change to only submit changed data later
    onSubmit(data);
  };

  return (
    <View>
      <View style={styles.formContainer}>
        <Text>Name</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Name*"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
            />
          )}
          name="name"
          defaultValue={defaultValues.name}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        <Text>Amount</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Amount*"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              keyboardType="numeric"
            />
          )}
          name="amount"
          defaultValue={defaultValues.amount}
        />
        {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}

        <Text>Unit</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                mode="dropdown" //android
              >
                <Picker.Item label="kg" value="kg" />
                <Picker.Item label="g" value="g" />
                <Picker.Item label="l" value="l" />
                <Picker.Item label="ml" value="ml" />
                <Picker.Item label="pcs" value="pcs" />
              </Picker>
            </View>
          )}
          name="unit"
          defaultValue={defaultValues.unit}
        />
        {errors.unit && <Text style={styles.errorText}>{errors.unit.message}</Text>}

        <Text>Price per kg</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Price per kg*"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              keyboardType="numeric"
            />
          )}
          name="pricePerKg"
          defaultValue={defaultValues.price_per_kg}
        />
        {errors.pricePerKg && <Text style={styles.errorText}>{errors.pricePerKg.message}</Text>}

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
  }
});