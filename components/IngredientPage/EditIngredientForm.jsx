import { StyleSheet, TextInput, View, Text, Pressable } from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../Button";

const schema = yup
  .object({
    name: yup
      .string().required().min(3).max(99),
    amount: yup
      .number().required().min(0),
    unit: yup
      .string().required(),
    costPerKg: yup
      .number().required().min(0),
    costPerUnit: yup
      .number().min(0),
    expirationDate: yup
      .date(),
    buyDate: yup
      .date(),
    aisle: yup
      .string().min(3).max(49),
    brand: yup
      .string().min(3).max(99),
    store: yup
      .string().min(3).max(99),
    onSale: yup
      .boolean(),
    inPantry: yup
      .boolean(),
  })
  .required();


export default function EditIngredientForm({ onClose, onSubmit, ingredient }) {
  const defaultValues = {
    name: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit,
    costPerKg: ingredient.cost_per_kg,
    costPerUnit: ingredient.cost_per_unit ? ingredient.cost_per_unit : undefined,
    expirationDate: ingredient.expiration_date ? new Date(ingredient.expiration_date) : undefined,
    buyDate: ingredient.buy_date ? new Date(ingredient.buy_date) : undefined,
    aisle: ingredient.aisle ? ingredient.aisle : undefined,
    brand: ingredient.brand ? ingredient.brand : undefined,
    store: ingredient.store ? ingredient.store : undefined,
    onSale: ingredient.on_sale,
    inPantry: ingredient.in_pantry
  };

  const [expirationDate, setExpirationDate] = useState(defaultValues.expirationDate);
  const [buyDate, setBuyDate] = useState(defaultValues.buyDate);
  const [showExpirationDatePicker, setShowExpirationDatePicker] = useState(false);
  const [showBuyDatePicker, setShowBuyDatePicker] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [inPantry, setInPantry] = useState(true);

  const { control, handleSubmit, formState: { errors, isDirty }, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const onHandleSubmit = (data) => {
    console.log("Submitting:", data);
    // change to only submit changed data later
    onSubmit(data);
  };

  const showDatepicker = (field) => {
    if (field === "expirationDate") setShowExpirationDatePicker(true);
    else if (field === "buyDate") setShowBuyDatePicker(true);
  };

  const onChangeDate = (event, field) => {
    const selectedDate = new Date(event.nativeEvent.timestamp);
    if (event.type === "neutralButtonPressed") {
      if (field === "expirationDate") {
        setExpirationDate(null);
        setValue("expirationDate", undefined, {
          shouldDirty: true
        });
      }
      else if (field === "buyDate") {
        setBuyDate(null);
        setValue("buyDate", undefined, {
          shouldDirty: true
        });
      }
    } else if (event.type === "set") {
      const currentDate = selectedDate;
      if (field === "expirationDate") {
        setExpirationDate(currentDate);
        setValue("expirationDate", currentDate, {
          shouldDirty: true
        });
      }
      else if (field === "buyDate") {
        setBuyDate(currentDate);
        setValue("buyDate", currentDate, {
          shouldDirty: true
        });
      }
    }
    setShowExpirationDatePicker(false);
    setShowBuyDatePicker(false);
  };

  const onChangeCheckbox = (field, value) => {
    if (field === "onSale") setOnSale(value);
    if (field === "inPantry") setInPantry(value);
    setValue(field, value);
  };

  return (
    <View>
      <View style={styles.formContainer}>
        {isDirty && <Text style={styles.errorText}>Unsaved changes!</Text>}
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
              autoCapitalize="none"
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
                <Picker.Item label="cl" value="cl" />
                <Picker.Item label="lbs" value="lbs" />
                <Picker.Item label="oz" value="oz" />
                <Picker.Item label="pcs" value="pcs" />
              </Picker>
            </View>
          )}
          name="unit"
          defaultValue={defaultValues.unit}
        />
        {errors.unit && <Text style={styles.errorText}>{errors.unit.message}</Text>}

        <Text>Cost per kg</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Cost per kg*"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              keyboardType="numeric"
            />
          )}
          name="costPerKg"
          defaultValue={defaultValues.costPerKg}
        />
        {errors.costPerKg && <Text style={styles.errorText}>{errors.costPerKg.message}</Text>}

        <Text>Cost per unit</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Cost per unit"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              keyboardType="numeric"
            />
          )}
          name="costPerUnit"
          defaultValue={defaultValues.costPerUnit}
        />
        {errors.costPerUnit && <Text style={styles.errorText}>{errors.costPerUnit.message}</Text>}

        <Text>Expiration date</Text>
        <Controller
          control={control}
          render={({ field: { name } }) => (
            <View>
              <Pressable onPress={() => showDatepicker(name)}>
                <TextInput
                  placeholder="Expiration date"
                  value={expirationDate?.toLocaleDateString() || null}
                  style={styles.textInput}
                  editable={false}
                />
              </Pressable>
              {showExpirationDatePicker && (
                <DateTimePicker
                  placeholderText="Select date"
                  value={expirationDate || new Date()}
                  mode="date"
                  display="spinner" // or default
                  onChange={(e) => onChangeDate(e, name)}
                  minimumDate={new Date(2020, 0, 1)}
                  neutralButton={{ label: "Clear", textColor: "grey" }} // android only
                  positiveButton={{ label: "OK", textColor: "green" }} // android only
                  negativeButton={{ label: "Cancel", textColor: "red" }} // android only
                />
              )}
            </View>
          )}
          name="expirationDate"
          defaultValue={defaultValues.expirationDate}
        />
        {errors.expirationDate && <Text style={styles.errorText}>{errors.expirationDate.message}</Text>}

        <Text>Buy date</Text>
        <Controller
          control={control}
          render={({ field: { name } }) => (
            <View>
              <Pressable onPress={() => showDatepicker(name)}>
                <TextInput
                  placeholder="Buy date"
                  value={buyDate?.toLocaleDateString() || null}
                  style={styles.textInput}
                  editable={false}
                />
              </Pressable>
              {showBuyDatePicker && (
                <DateTimePicker
                  placeholderText="Select date"
                  value={buyDate || new Date()}
                  mode="date"
                  display="spinner" // or default
                  onChange={(e) => onChangeDate(e, name)}
                  minimumDate={new Date(2020, 0, 1)}
                  neutralButton={{ label: "Clear", textColor: "grey" }} // android only
                  positiveButton={{ label: "OK", textColor: "green" }} // android only
                  negativeButton={{ label: "Cancel", textColor: "red" }} // android only
                />
              )}
            </View>
          )}
          name="buyDate"
          defaultValue={defaultValues.buyDate}
        />
        {errors.buyDate && <Text style={styles.errorText}>{errors.buyDate.message}</Text>}

        {/* Select from options? */}
        <Text>Aisle</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Aisle"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              autoCapitalize="none"
            />
          )}
          name="aisle"
          defaultValue={defaultValues.aisle}
        />
        {errors.aisle && <Text style={styles.errorText}>{errors.aisle.message}</Text>}

        <Text>Brand</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Brand"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              autoCapitalize="none"
            />
          )}
          name="brand"
          defaultValue={defaultValues.brand}
        />
        {errors.brand && <Text style={styles.errorText}>{errors.brand.message}</Text>}

        <Text>Store</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Store"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
            />
          )}
          name="store"
          defaultValue={defaultValues.store}
        />
        {errors.store && <Text style={styles.errorText}>{errors.store.message}</Text>}

        <Text>On sale</Text>
        <Controller
          control={control}
          render={({ field: { onBlur, name } }) => (
            <Checkbox
              style={styles.checkbox}
              onValueChange={(value) => onChangeCheckbox(name, value)}
              onBlur={onBlur}
              value={onSale}
            />
          )}
          name="onSale"
          defaultValue={defaultValues.onSale}
        />
        {errors.onSale && <Text style={styles.errorText}>{errors.onSale.message}</Text>}

        <Text>In pantry</Text>
        <Controller
          control={control}
          render={({ field: { onBlur, name } }) => (
            <Checkbox
              style={styles.checkbox}
              onValueChange={(value) => onChangeCheckbox(name, value)}
              onBlur={onBlur}
              value={inPantry}
            />
          )}
          name="inPantry"
          defaultValue={defaultValues.inPantry}
        />
        {errors.inPantry && <Text style={styles.errorText}>{errors.inPantry.message}</Text>}

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