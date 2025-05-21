import { StyleSheet, View, Text, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../Button";
import { useAuthSession } from "../../hooks/AuthProvider";
import * as Crypto from "expo-crypto";

const schema = yup
  .object({
    username: yup
      .string().required().min(3).max(99),
    password: yup
      .string().required().min(3),
  })
  .required();

export default function SignUpForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { signUp } = useAuthSession();

  const onHandleSubmit = (data) => {
    const token = Crypto.randomUUID();
    signUp(token, data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Sign up form</Text>
      <View style={styles.formContainer}>
        <Text>Username</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Username*"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              autoCapitalize="none"
            />
          )}
          name="username"
        />
        {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

        <Text>Password</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Password*"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textInput}
              autoCapitalize="none"
              secureTextEntry={true}
            />
          )}
          name="password"
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <View style={styles.buttonContainer}>
          <Button label="Sign up" theme="primary-icon" onPress={handleSubmit(onHandleSubmit)} icon="login" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5
  },
  formContainer: {
    padding: 10,
    width: 200,
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
    alignSelf: "center",
    paddingVertical: 20
  },
  formTitle: {
    alignSelf: "center",
    fontSize: 16,
  },
});