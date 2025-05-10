import { StyleSheet, View, Alert } from "react-native";
import { useAuthSession } from "../../hooks/AuthProvider";
import Button from "../Button";
import usersService from "../../services/users";

// in the future can add exporting data?
// name and password change

export default function SettingsPage() {
  const { signOut, userId } = useAuthSession();

  const logout = () => {
    signOut();
  };

  const onDeleteAccount = () => {
    Alert.alert("Delete account",
      "Are you sure you want to delete your account?", [
      {
        text: "Cancel",
        onPress: () => console.log("Deletion cancelled!"),
      },
      {
        text: "OK",
        onPress: () => deleteAccount()
      },
    ], {
      cancelable: true
    });
  };

  const deleteAccount = async () => {
    console.log("deleting account, userid", userId);
    try {
      const deletedUser = await usersService.deleteUser(userId);
      if (deletedUser) {
        signOut();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Button label="logout" onPress={logout} theme="primary-icon" icon="logout" />
      <Button label="Delete my account" onPress={onDeleteAccount} theme="primary-icon" icon="delete" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "space-around",
    alignItems: "center",
    //flex: 1,
    padding: 10,
    height: 300,
    borderRadius: 5,
  },
});