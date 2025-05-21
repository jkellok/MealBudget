import { StyleSheet, TextInput, View, Text, Pressable, Dimensions, ScrollView } from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../Button";
import { router } from "expo-router";
import ingredientService from "../../services/ingredients";
import { useAuthSession } from "../../hooks/AuthProvider";

const schema = yup
  .object({
    name: yup
      .string().required().min(3).max(100),
    amount: yup
      .number().required().min(0).max(9999),
    unit: yup
      .string().required(),
    costPerKg: yup
      .number().required().min(0).max(9999),
    costPerPackage: yup
      .number().min(0).max(9999),
    expirationDate: yup
      .date(),
    buyDate: yup
      .date(), //.default(() => new Date()),
    aisle: yup
      .string().min(3).max(50),
    brand: yup
      .string().min(3).max(50),
    store: yup
      .string().min(3).max(100),
    onSale: yup
      .boolean().default(false),
    inPantry: yup
      .boolean().default(true),
    weightPerPiece: yup
      .number().min(0).max(9999),
  })
  .required();

const defaultValues = {
  unit: "kg",
  onSale: false,
  inPantry: true
};

export default function AddIngredientForm() {
  const [expirationDate, setExpirationDate] = useState(null);
  const [buyDate, setBuyDate] = useState(null);
  const [showExpirationDatePicker, setShowExpirationDatePicker] = useState(false);
  const [showBuyDatePicker, setShowBuyDatePicker] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [inPantry, setInPantry] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuthSession();

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    //resolver: yupResolver(schema),
    resolver: async (data, context, options) => {
      console.log("formdata", data);
      console.log(
        "validation result",
        await yupResolver(schema)(data, context, options)
      );
      return yupResolver(schema)(data, context, options);
    },
  });

  const onHandleSubmit = async (values) => {
    try {
      const ingredient = await ingredientService.createNewIngredient(values, userId.current);
      console.log("ingredient submitted", ingredient);
      router.dismiss();
    } catch (err) {
      console.error(err);
      setError("Error submitting new ingredient");
    }
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
        setValue("expirationDate", undefined);
      }
      else if (field === "buyDate") {
        setBuyDate(null);
        setValue("buyDate", undefined);
      }
    } else if (event.type === "set") {
      const currentDate = selectedDate;
      if (field === "expirationDate") {
        setExpirationDate(currentDate);
        setValue("expirationDate", currentDate);
      }
      else if (field === "buyDate") {
        setBuyDate(currentDate);
        setValue("buyDate", currentDate);
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

  const onCancel = () => {
    router.dismiss();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.formContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <Text>Name*</Text>
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
                maxLength={100}
              />
            )}
            name="name"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

          <View style={styles.groupedInputContainer}>
            <View>
              <Text>Amount*</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Amount*"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.textInput, { width: 110 }]}
                    keyboardType="numeric"
                    maxLength={7}
                  />
                )}
                name="amount"
              />
            </View>

            <View>
              <Text>Unit*</Text>
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
            </View>

            <View>
              <Text>In pantry</Text>
              <Controller
                control={control}
                render={({ field: { onBlur, name } }) => (
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      onValueChange={(value) => onChangeCheckbox(name, value)}
                      onBlur={onBlur}
                      value={inPantry}
                    />
                  </View>
                )}
                name="inPantry"
                defaultValue={defaultValues.inPantry}
              />
            </View>
          </View>
          {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}
          {errors.unit && <Text style={styles.errorText}>{errors.unit.message}</Text>}
          {errors.inPantry && <Text style={styles.errorText}>{errors.inPantry.message}</Text>}

          <View style={styles.groupedInputContainer}>
            <View>
              <Text>Cost per kg*</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Cost per kg*"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.textInput, { width: 110 }]}
                    keyboardType="numeric"
                    maxLength={7}
                  />
                )}
                name="costPerKg"
              />
            </View>

            <View>
              <Text>Cost per package</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Cost per package"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.textInput, { width: 110 }]}
                    keyboardType="numeric"
                    maxLength={7}
                  />
                )}
                name="costPerPackage"
              />
            </View>

            <View>
              <Text>On sale</Text>
              <Controller
                control={control}
                render={({ field: { onBlur, name } }) => (
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      onValueChange={(value) => onChangeCheckbox(name, value)}
                      onBlur={onBlur}
                      value={onSale}
                    />
                  </View>
                )}
                name="onSale"
                defaultValue={defaultValues.onSale}
              />
            </View>
          </View>
          {errors.costPerKg && <Text style={styles.errorText}>{errors.costPerKg.message}</Text>}
          {errors.costPerPackage && <Text style={styles.errorText}>{errors.costPerPackage.message}</Text>}
          {errors.onSale && <Text style={styles.errorText}>{errors.onSale.message}</Text>}

          <View style={styles.groupedInputContainer}>
            <View>
              <Text>Expiration date</Text>
              <Controller
                control={control}
                render={({ field: { name } }) => (
                  <View>
                    <Pressable onPress={() => showDatepicker(name)}>
                      <TextInput
                        placeholder="Expir. date"
                        value={expirationDate?.toLocaleDateString() || null}
                        style={[styles.textInput, { width: 110 }]}
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
              />
            </View>

            <View>
              <Text>Buy date</Text>
              <Controller
                control={control}
                render={({ field: { name } }) => (
                  <View>
                    <Pressable onPress={() => showDatepicker(name)}>
                      <TextInput
                        placeholder="Buy date"
                        value={buyDate?.toLocaleDateString() || null}
                        style={[styles.textInput, { width: 110 }]}
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
              />
            </View>
          </View>
          {errors.expirationDate && <Text style={styles.errorText}>{errors.expirationDate.message}</Text>}
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
                maxLength={50}
              />
            )}
            name="aisle"
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
                maxLength={50}
              />
            )}
            name="brand"
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
                maxLength={100}
              />
            )}
            name="store"
          />
          {errors.store && <Text style={styles.errorText}>{errors.store.message}</Text>}

          <Text>Weight per piece in grams (if using pieces)</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Weight per piece (g))"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.textInput}
                maxLength={100}
              />
            )}
            name="weightPerPiece"
          />
          {errors.weightPerPiece && <Text style={styles.errorText}>{errors.weightPerPiece.message}</Text>}

        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button label="Cancel" onPress={onCancel} />
        <Button label="Add" theme="primary-icon" onPress={handleSubmit(onHandleSubmit)} icon="add" />
      </View>
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
    borderRadius: 6,
  },
  errorText: {
    color: "red"
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 3,
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
});