import { Modal, View, Text, Pressable, StyleSheet, Dimensions, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ModalComponent({ isVisible, children, onClose, title }) {
  return (
    <View style={styles.modalContainer}>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" color="#fff" size={22} />
            </Pressable>
          </View>
          <ScrollView style={styles.modalChildrenContent}>
            {children}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#eee",
    borderRadius: 18,
    alignSelf: "center",
    //width: Dimensions.get("window").width * 0.85,
    //height: Dimensions.get("window").height * 0.9,
    paddingBottom: 8,
    flex: 1,
    marginVertical: 10,
  },
  titleContainer: {
    height: 50,
    backgroundColor: "#464C55",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
  },
  modalChildrenContent: {
  },
});