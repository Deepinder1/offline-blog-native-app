import * as React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Actions } from "react-native-router-flux";
import { Appbar } from "react-native-paper";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  DefaultTheme,
} from "react-native-paper";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite";
import { db } from "../db/db";
import { Entypo } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function First() {
  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE if not exists blogs (id INTEGER primary key not null, title TEXT, para TEXT,img BLOB,created_time TEXT,updated_time TEXT);"
      );
    });
  }, []);
  const theme = {
    ...DefaultTheme,
    roundness: 5,
    colors: {
      ...DefaultTheme.colors,
      primary: "#fff",
      color: "#fff",
      placeholder: "grey",
      backgroundColor: "black",
      text: "#fff",
    },
  };

  const [title, setTitle] = React.useState("");
  const [para, setPara] = React.useState("");
  const [truncated, readMore] = React.useState(true);
  const [img, setImg] = React.useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImg(result.uri);
    }
  };

  return (
    <View style={{ display: "flex", flex: 1, backgroundColor: "black" }}>
      <Appbar.Header
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          backgroundColor: "#141414",
        }}
      >
        <Entypo
          style={{ marginRight: windowWidth * 0.03 }}
          onPress={() => {
            Actions.Second();
          }}
          name="eye"
          size={24}
          color="white"
        />
        <Title
          style={{
            flex: 1,
            justifyContent: "center",
            color: "white",
            marginLeft: windowWidth * 0.04,
          }}
        >
          Write a Blog
        </Title>
      </Appbar.Header>

      <Card style={{ backgroundColor: "black" }}>
        <TextInput
          style={{ backgroundColor: "black" }}
          theme={theme}
          placeholder={"Title"}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <TouchableOpacity onPress={pickImage}>
          <Card.Cover
            resizeMode={img ? "stretch" : "contain"}
            source={{
              uri: img
                ? img
                : "https://static.thenounproject.com/png/187803-200.png",
            }}
          />
        </TouchableOpacity>
        <Card.Content>
          <Paragraph style={{ color: "white" }}>Blog content</Paragraph>
          <TextInput
            style={{ backgroundColor: "black" }}
            theme={theme}
            value={para}
            numberOfLines={2}
            multiline={true}
            onChangeText={(text) => setPara(text)}
          />
        </Card.Content>

        <Card.Actions>
          <Button
            theme={theme}
            onPress={() => {
              var dateString = new Date();
              dateString = dateString.toString();
              dateString = dateString.split(" ").slice(0, 5).join(" ");
              db.transaction((tx) => {
                tx.executeSql(
                  "INSERT into blogs (title,para,img,created_time,updated_time) VALUES ( ?,?,?,?,?)",
                  [title, para, img, dateString, ""]
                );
              });
              Actions.Second();
            }}
          >
            Save{" "}
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
