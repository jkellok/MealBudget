import { StyleSheet, TextInput, View, Text, Pressable, ScrollView, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import ingredientService from "../../services/ingredients";
import { useAuthSession } from "../../hooks/AuthProvider";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../Button";
import { router } from "expo-router";

const schema = yup
  .object({
    name: yup
      .string().required().min(3).max(100),
    amount: yup
      .number().required().min(0).max(10000),
    unit: yup
      .string().required(),
    costPerKg: yup
      .number().required().min(0).max(10000),
    costPerPackage: yup
      .number().min(0).max(10000),
    expirationDate: yup
      .date(),
    buyDate: yup
      .date(),
    aisle: yup
      .string().min(3).max(50),
    brand: yup
      .string().min(3).max(50),
    store: yup
      .string().min(3).max(1000),
    onSale: yup
      .boolean(),
    inPantry: yup
      .boolean(),
    weightPerPiece: yup
      .number().min(0).max(9999),
  })
  .required();

const EditForm = ({ defaultValues, onSubmit, onCancel, error }) => {

  const [expirationDate, setExpirationDate] = useState(defaultValues.expirationDate);
  const [buyDate, setBuyDate] = useState(defaultValues.buyDate);
  const [showExpirationDatePicker, setShowExpirationDatePicker] = useState(false);
  const [showBuyDatePicker, setShowBuyDatePicker] = useState(false);
  const [onSale, setOnSale] = useState(defaultValues.onSale);
  const [inPantry, setInPantry] = useState(defaultValues.inPantry);

  const { control, handleSubmit, formState: { errors, isDirty }, setValue, resetField } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues
  });

  const onHandleSubmit = async (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
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
    <>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.formContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {isDirty && <Text style={styles.errorText}>Unsaved changes!</Text>}

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
            defaultValue={defaultValues.name}
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
                defaultValue={defaultValues.amount}
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
                      <Picker.Item label="kg" value="kg" style={styles.pickerItem} />
                      <Picker.Item label="g" value="g" style={styles.pickerItem} />
                      <Picker.Item label="l" value="l" style={styles.pickerItem} />
                      <Picker.Item label="ml" value="ml" style={styles.pickerItem} />
                      <Picker.Item label="cl" value="cl" style={styles.pickerItem} />
                      <Picker.Item label="lbs" value="lbs" style={styles.pickerItem} />
                      <Picker.Item label="oz" value="oz" style={styles.pickerItem} />
                      <Picker.Item label="pcs" value="pcs" style={styles.pickerItem} />
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
                defaultValue={defaultValues.costPerKg}
              />
            </View>

            <View>
              <Text>Cost per pkg</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Cost per pkg"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.textInput, { width: 110 }]}
                    keyboardType="numeric"
                    maxLength={7}
                  />
                )}
                name="costPerPackage"
                defaultValue={defaultValues.costPerPackage}
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
                defaultValue={defaultValues.expirationDate}
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
                defaultValue={defaultValues.buyDate}
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
                maxLength={50}
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
                maxLength={100}
              />
            )}
            name="store"
            defaultValue={defaultValues.store}
          />
          {errors.store && <Text style={styles.errorText}>{errors.store.message}</Text>}

          <Text>Weight per piece in grams (if using pieces)</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Weight per piece (g)"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.textInput}
                maxLength={100}
              />
            )}
            name="weightPerPiece"
            defaultValue={defaultValues.weightPerPiece}
          />
          {errors.weightPerPiece && <Text style={styles.errorText}>{errors.weightPerPiece.message}</Text>}

        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button label="Cancel" onPress={handleCancel} />
        <Button label="Update" theme="primary" onPress={handleSubmit(onHandleSubmit)} />
      </View>
    </>
  );
};

export default function EditIngredientForm() {
  const { id } = useLocalSearchParams();
  const [ingredient, setIngredient] = useState([]);
  const { userId } = useAuthSession();
  const [error, setError] = useState(null);

  useEffect(() => {
    const getIngredient = async (id) => {
      const ingredient = await ingredientService.getIngredient(id, userId.current);
      setIngredient(ingredient);
    };
    getIngredient(id);
  }, [id, userId]);

  if (ingredient.length === 0) return null;

  const defaultValues = {
    name: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit,
    costPerKg: ingredient.cost_per_kg,
    costPerPackage: ingredient.cost_per_package ? ingredient.cost_per_package : undefined,
    expirationDate: ingredient.expiration_date ? new Date(ingredient.expiration_date) : undefined,
    buyDate: ingredient.buy_date ? new Date(ingredient.buy_date) : undefined,
    aisle: ingredient.aisle ? ingredient.aisle : undefined,
    brand: ingredient.brand ? ingredient.brand : undefined,
    store: ingredient.store ? ingredient.store : undefined,
    onSale: ingredient.on_sale,
    inPantry: ingredient.in_pantry,
    weightPerPiece: ingredient.weight_per_piece ? ingredient.weight_per_piece : undefined,
  };

  const onSubmit = async (values) => {
    try {
      const updatedIngredient = await ingredientService.updateIngredient(values, ingredient.ingredient_id, userId.current);
      console.log("ingredient submitted", updatedIngredient);
      router.dismiss();
    } catch (err) {
      console.error(err);
      setError("Error editing the ingredient");
    }
  };

  const onCancel = () => {
    router.dismiss();
  };

  return (
    <View style={styles.container}>
      <EditForm defaultValues={defaultValues} onSubmit={onSubmit} onCancel={onCancel} error={error} />
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