import { useEffect, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { useMeals } from '../data/mealData';
import SearchedMealObject from '../objects/searchedMealObject';

const screenWidth = Dimensions.get('window').width;

export default function RecentlyEaten({ selectedMeal, selectedFoodItems, selectedFoodItem, date }) {
    const { recentlyEaten } = useMeals();
    console.log(recentlyEaten);
    const [mealSpecificRecent, setMealSpecificRecent] = useState([]);
    const [allRecents, setAllRecents] = useState([]);

    console.log("mealSpecificRecent: ", mealSpecificRecent);

    console.log("selectedMeal: ", selectedMeal);

    useEffect(() => {
        loadLists();
    }, []);
    
    useEffect(() => {
        loadLists();
    }, [selectedMeal]);

    // seperate lists
    // then combind all lists except for the selected meal
    function loadLists() {
        setMealSpecificRecent(prev => {
            const newList = recentlyEaten[selectedMeal.toLowerCase()] || [];
            newList.sort((a, b) => b.timeAdded - a.timeAdded);
            return newList;
        });
        console.log("mealSpecificRecent: ", mealSpecificRecent);
    }

    return (
        <View style={{ width: screenWidth, height: '100%', alignItems: 'center', paddingTop: 20 }}>
            <FlatList
                keyboardShouldPersistTaps="handled"
                data={(mealSpecificRecent || [])}
                style={{width: '90%'}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <SearchedMealObject
                        item={item}
                        isSelected={selectedFoodItems.has(item.gtinUpc)}
                        onSelect={selectedFoodItem}
                        date={date}
                    />
                )}
            />
        </View>
    )
}