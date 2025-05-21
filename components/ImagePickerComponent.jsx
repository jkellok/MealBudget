import { useEffect, useState } from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import IconButton from "./IconButton";
import Button from "./Button";

export default function ImagePickerComponent({ handleSelectedImage, showField, defaultImage }) {
  const [image, setImage] = useState(null);
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [showImageSelectionOptions, setShowImageSelectionOptions] = useState(true);

  // if an image exists in edit form, set as an image and show reset option
  useEffect(() => {
    if (defaultImage) {
      setShowImageSelectionOptions(false);
      setImage(defaultImage);
    }
  }, [defaultImage]);

  // haven't tested permissions properly
  if (cameraPermission?.status !== ImagePicker.PermissionStatus.GRANTED) {
    return (
      <View style={styles.container}>
        <Text>Camera permission not granted</Text>
        <Button label="Request permission" onPress={requestCameraPermission} />
      </View>
    );
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
        aspect: [1, 1]
      });

      if (!result.canceled) {
        onHandleImage(result.assets[0].uri);
      }
    } catch (err) {
      alert("Error picking image", err.message);
    }
  };

  const useCamera = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
        aspect: [1, 1]
      });

      if (!result.canceled) {
        onHandleImage(result.assets[0].uri);
        // test this with built app
        //await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
      }
    } catch (err) {
      alert("Error using the camera", err.message);
    }
  };

  const onReset = () => {
    setImage(null);
    setShowImageSelectionOptions(true);
    handleSelectedImage(undefined);
    showField(false);
  };

  const onHandleImage = async (imageUri) => {
    setImage(imageUri);
    setShowImageSelectionOptions(false);
    // send image uri to form
    handleSelectedImage(imageUri);
  };

  const onShowFieldInForm = () => {
    showField(true);
    setShowImageSelectionOptions(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsRow}>
        {showImageSelectionOptions ? (
          <>
            <IconButton icon="image" label="Select image" onPress={pickImage} />
            <IconButton icon="camera-alt" label="Use camera" onPress={useCamera} />
            <IconButton icon="edit" label="Paste URL" onPress={onShowFieldInForm} />
          </>
        ) : (
          <>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 40,
    height: 40,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});