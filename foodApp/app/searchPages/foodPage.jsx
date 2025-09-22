import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import SearchedMealObject from '../objects/searchedMealObject';

const screenWidth = Dimensions.get('window').width;

export default function FoodPage({ showThrobber, foodItems, searchHistory, searchQuery, searchText, selectedFoodItems, selectedFoodItem, date }) {
    const [recentSearchList, setRecentSearchList] = useState(searchHistory);

    useEffect(() => {
        console.log("searchQuery: ", searchText);
        // filter list from searchHistory
        setRecentSearchList(prev => {
            const newList = [...searchHistory].filter(item => item.toLowerCase().includes(searchText.toLowerCase()));
            return new Set(newList);
        })
    }, [searchText]);

    return (
        <View style={{ width: screenWidth, height: '100%' }}>
            <View style={{alignItems: 'center', paddingTop: 20}}>
                {showThrobber && (<ActivityIndicator size="large" color="#ffffff" />)}
                {(!showThrobber && foodItems.length == 0) && <FlatList keyboardShouldPersistTaps="handled" keyboardDismissMode='on-drag' data={[...recentSearchList].reverse()} keyExtractor={(item, index) => index.toString()}
                    style={{width: '100%', height: '100%'}}
                    renderItem={({ item, index }) => (
                        <Pressable onPress={() => {Keyboard.dismiss(); searchQuery(item);}}>
                            <View style={{width: '100%', alignItems: 'center'}}>
                                <View style={{width: '90%'}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Text style={{color: 'white', paddingVertical: 10, fontSize: 16}}>{item}</Text>
                                        <IconSymbol size={20} name={'arrow.up.backward'} color={'#444'} />
                                    </View>
                                    <View style={{borderBottomColor: '#444', borderBottomWidth: 1, width: '100%'}} />
                                </View>
                            </View>
                        </Pressable>
                    )}
                />}
                <FlatList keyboardDismissMode="on-drag" style={styles.foodFlatList} data={foodItems} keyExtractor={(item) => item.gtinUpc.toString()}
                    extraData={selectedFoodItems}
                    renderItem={({ item }) => (
                        <SearchedMealObject
                            item={item}
                            isSelected={selectedFoodItems.has(item.gtinUpc)}
                            onSelect={selectedFoodItem}
                            date={date}
                        />
                    )}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    foodBox: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: '#444455',
		marginBottom: 10,
		borderRadius: '5%',
		padding: 10,
	},
    infoView: {
		flex: 1,
	},
    foodName: {
		color: 'white',
		fontSize: 26,
	},
    foodInfoText: {
		color: 'white',
		fontSize: 15,
	},
    addButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		borderRadius: '100%',
	},
    foodFlatList: {
		width: '90%',
	},
})