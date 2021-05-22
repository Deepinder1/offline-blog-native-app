import * as React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import { db } from '../db/db';
import { Actions } from 'react-native-router-flux';
import { MaterialIcons } from '@expo/vector-icons';
export default function Second() {
    const [data, setData] = React.useState([]);
    const [results, setResults] = React.useState([]);
    const [deletable, setDeletable] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (q) => {
        setSearchQuery(q);
        showResult(q);
    };
    const showResult = (q) => {
        setResults(data);
        if (q){
            let ele = [];
            data.forEach((element)=>{
                if(element.title.toLowerCase().includes(q.toLowerCase()) || element.para.toLowerCase().includes(q.toLowerCase())){
                    ele.push(element)
                }
            });
            setResults(ele);
        }
    };

    React.useEffect(() => {
        db.transaction(
            (tx) => {
                //  tx.executeSql("insert into blogs (title,para,img) values ( ?,?,?)", [text,paratext,img]);
                tx.executeSql("select * from blogs", [], (_, { rows }) => {
                    setData(rows._array);
                    setResults(rows._array);
                }

                );
            },

        );
    }, [])
    const renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity
                onPress={() => {
                    {
                        if (deletable) {
                            const newData = data.map((e) => {
                                if (e.id === item.id) {
                                    return {
                                        ...e,
                                        selected: !e.selected
                                    }
                                }
                                return {
                                    ...e,
                                    selected: e.selected || false
                                }

                            })
                            setData(newData);
                            setResults(newData);
                        }
                        else {
                            Actions.Third({

                                id: item.id,
                                title: item.title,
                                para: item.para,
                                img: item.img,
                                created_time: item.created_time,
                                updated_time: item.updated_time,

                            })
                        }
                    }
                }}
                onLongPress={() => {
                    setDeletable(true)
                    const newData = data.map((e) => {
                        if (e.id === item.id) {
                            return {
                                ...e,
                                selected: true
                            }
                        }
                        return {
                            ...e,
                            selected: false
                        }

                    })
                    setData(newData);
                    setResults(newData);
                }}
                style={{
                    flexDirection: "row",
                    backgroundColor: item.selected ? 'grey' : 'transparent',
                    alignItems: "center",
                    width: "100%",
                    textAlignVertical: "center",
                    justifyContent: "space-around",
                    padding: 8,
                    marginVertical: 2,
                    flex: 1
                    }} >
                <Image style={{ width: 75, height: 75, borderRadius: 35, marginRight: 10 }} source={{ uri: item.img ? item.img : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png' }} />
                <View style={{ flex: 1 }}>
                    <Text>{item.title}</Text>
                    <Text>{item.para.slice(0, 30) + '......'}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    return (
        <View style={{ flex: 1, display: 'flex' }}>
            
            <Appbar.Header style={{ display: 'flex', flexDirection: 'row' }}>
                <Appbar.BackAction onPress={() => { Actions.pop() }} />
                <Appbar.Content title="Blogs" />
                <MaterialIcons onPress={() => {
                     data.forEach((e)=>{
                        
                        if( e.selected)
                        {
                            db.transaction(
                                (tx) => {
                                  tx.executeSql(`delete from blogs where id = ?;`, [e.id]);
                                },
                                
                              )
                                Actions.Second();
                            
                        }
                    })
                   


                    
                }} name="delete" size={24} color="white" />
            </Appbar.Header>
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
            <FlatList
                style={{ flex: 1 }}
                data={results}
                renderItem={renderItem}
                keyExtractor={(item) => `key-${item.id}`}
            />
        </View>

    );
}