import * as React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView,Share } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { db } from '../db/db';
import { useEffect, useState } from 'react/cjs/react.production.min';
import { render } from 'react-dom';
import { Actions } from 'react-native-router-flux';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { Entypo } from '@expo/vector-icons';
export default function Third(props) {
  const [editable, setEditable] = React.useState(false);
  const [title, setTitle] = React.useState(props.title);
  const [para, setPara] = React.useState(props.para);
  const [img, setImg] = React.useState(props.img);
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
    <ScrollView style={{ flex: 1, display: 'flex' }}>
      <Appbar.Header style={{ display: 'flex', flexDirection: 'row' }}>
        <Appbar.BackAction onPress={() => { Actions.pop() }} />
        <Appbar.Content title="Blog" />
        {editable ? <Entypo onPress={() => { setEditable(!editable) }} name="cross" size={24} color="white" /> : <FontAwesome onPress={() => { setEditable(!editable) }} name="pencil" size={24} color="white" />}
      </Appbar.Header>
      {editable ?
        <Card>
          <TextInput 

            value={title}
            onChangeText={text => setTitle(text)}
          />
          <TouchableOpacity onPress={pickImage}>
            <Card.Cover resizeMode={img ? 'stretch' : 'contain'} source={{ uri: img ? img : 'https://static.thenounproject.com/png/187803-200.png' }} />
          </TouchableOpacity>
          <Card.Content>
            <Paragraph style={{fontWeight: 'bold'}}>Blog content</Paragraph>
            <TextInput
              value={para}
              numberOfLines={2}
              multiline={true}
              onChangeText={text => setPara(text)}
            />
            <Text style={{ color: 'grey', fontSize: 9 }}> Created: {props.created_time}</Text>
            <Text style={{ color: 'grey', fontSize: 9 }}> Updated:{props.updated_time}</Text>
          </Card.Content>
          <Card.Actions>
            {editable && <Button
              onPress={() => {
                var dateString = new Date();
                dateString = dateString.toString();
                dateString = dateString.split(' ').slice(0, 5).join(' ');
                db.transaction(
                  (tx) => {
                    tx.executeSql("update blogs set title = ? , para = ? , img = ? ,updated_time = ?  where id = ? ", [title, para, img, dateString, props.id]);
                  },

                );
                Actions.Second();
              }}
            >
              Save</Button>}
          </Card.Actions>
        </Card>
        :
        <Card>
          <Title style={{marginBottom:5,marginLeft:13}}> {props.title}</Title>
          <Card.Cover resizeMode={props.img ? 'stretch' : 'contain'} source={{ uri: props.img ? props.img : 'https://static.thenounproject.com/png/187803-200.png' }} />
          <Card.Content>
            
            <Paragraph  style={{textAlign:'justify'}} numberOfLines={50} ellipsizeMode="tail">
              {props.para}
            </Paragraph>
            <Text style={{ color: 'grey', fontSize: 9 }}> Created: {props.created_time}</Text>
            <Text style={{ color: 'grey', fontSize: 9 }}> {props.updated_time && `Updated: ${props.updated_time}` }</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress=
            {async ()=>{
            let message= 'Title \n '+ `${props.title} \n \n `+'Content \n \n'+`${props.para} \n`
              try {
                const result = await Share.share({
                  message: message,
                });
                if (result.action === Share.sharedAction) {
                  if (result.activityType) {
                      } else {
                    // shared
                  }
                } else if (result.action === Share.dismissedAction) {
                  // dismissed
                }
              } catch (error) {
                alert(error.message);
              }
             }}>
              Share</Button>
            </Card.Actions>
        </Card>
      }
    </ScrollView>
  );
}