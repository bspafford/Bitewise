import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    GestureHandlerRootView
} from 'react-native-gesture-handler';

import { useMeals } from '../data/mealData';
import AddedFood from './addedFood';

export default function mealObject({ date, mealName, foodItems, addFoodForMeal }) {
    const { meals, getLabelNutrients } = useMeals();

    const [visible, setVisible] = useState(false);
    const position = useRef(new Animated.Value(0)).current;

    const [totalMacros, setTotalMacros] = useState({calories: 0, protein: 0, carbs: 0, fats: 0,});

    useEffect(() => {
        const foods = meals[date]?.[mealName.toLowerCase()] ?? [];
        const newTotals = foods.reduce(
            (acc, food) => {
                acc.calories += Number(getLabelNutrients(food.item, "calories") * food.servings) || 0;
                acc.protein += Number(getLabelNutrients(food.item, "protein") * food.servings) || 0;
                acc.carbs += Number(getLabelNutrients(food.item, "carbohydrates") * food.servings) || 0;
                acc.fats += Number(getLabelNutrients(food.item, "fat") * food.servings) || 0;
                return acc;
            },
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );
        setTotalMacros(newTotals);
    }, [meals, mealName, date]);

    const toggleList = () => {
        if (!visible) { // show list
            setVisible(true);
            Animated.timing(position, {
                toValue: 1,
                duration: 350,
                useNativeDriver: false,
            }).start();
        } else { // hide list
            setVisible(false);
            Animated.timing(position, {
                toValue: 0,
                duration: 350,
                useNativeDriver: false,
            }).start();
        }
    };

    const listHeight = position.interpolate({
        inputRange: [0, 1],
        outputRange: [0, foodItems.length * 83],
    });

    const arrowRotate = position.interpolate({
        inputRange: [0, 1],
    	outputRange: ['0deg', '180deg'],
    });

    function capitalizeFirstLetter(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getMealSymbol(mealName) {
        switch(mealName) {
            case "breakfast":
                return {icon: "sun.dust", color: '#B3DFFC'};
            case "lunch":
                return {icon: "sun.max", color: '#FFD54F'};
            case "dinner":
                return {icon: "sun.haze", color: '#FF8A65'};
            case "snack":
                return {icon: "moon.stars", color: '#6A4CA4'};
            default:
                return {icon: "none", color: 'white'};
        }
    }

    const formatNumber = (num) => {
        return num.toFixed(1) % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
    }

    return (
        <View style={[styles.center, {paddingBottom: 20}]}>
            <View style={styles.mealView}>
                <View style={styles.mealHeader}>
                    <Pressable style={[{paddingHorizontal: 10, paddingTop: 10, paddingBottom: 5, flex: 1, backgroundColor: '#444', borderRadius: 10}]} onPress={toggleList}>
                        <View style={[{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                            <View style={{display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                                <IconSymbol size={30} name={getMealSymbol(mealName).icon} color={getMealSymbol(mealName).color} />
                                <Text style={styles.mealName}>{capitalizeFirstLetter(mealName)}</Text>
                            </View>
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10}}>
                                <View style={{alignItems: 'flex-end'}}>
                                    <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{totalMacros.calories.toFixed(0)}</Text>
                                    <Text style={{color: 'white', fontSize: 12}}>Calories</Text>
                                </View>
                                <Animated.View style={[{transform: [{rotate: arrowRotate}]}]}>
                                    <IconSymbol size={20} name={"chevron.down"} color={'#ffffff'} />
                                </Animated.View>
                            </View>
                        </View>
                        <View style={styles.macrosInfo}>
                            <Text style={styles.text}>{formatNumber(totalMacros.protein)}</Text>
                            <Text style={styles.text}>{formatNumber(totalMacros.carbs)}</Text>
                            <Text style={styles.text}>{formatNumber(totalMacros.fats)}</Text>
                        </View>
                    </Pressable>
                    <Pressable style={{height: '100%'}} onPress={() => {addFoodForMeal(mealName)}}>
                        <View style={{flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
                            <IconSymbol size={28} name={'plus'} color={'#fff'} />
                        </View>
                    </Pressable>
                </View>
                <Animated.View style={[styles.mealList, {overflow: 'hidden', height: listHeight, opacity: position}]}>
                    {/* {children} */}
                    <GestureHandlerRootView>
                        {foodItems.map((food, index) => (
                            <View key={`${food.item.fdcId}-${food.timeAdded}-${Math.random()}`}>
                                {index != 0 && (<View style={styles.hr}></View>)}
                                <AddedFood food={food} date={date} meal={mealName} index={index}></AddedFood>
                            </View>
                        ))}
                    </GestureHandlerRootView>
                </Animated.View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
    },
    hr: {
        borderBottomWidth: 1,
        borderBottomColor: '#666',
        width: '90%',
        left: '5%',
    },
    center: {
        display: 'flex',
        alignItems: 'center',        
        width: '100%',
    },
    mealView: {
        borderRadius: 10,
        width: '90%',
        backgroundColor: '#222',
    },
    mealHeader: {
        borderRadius: 10,
        backgroundColor: '#333',
        flexDirection: 'row',
    },
    mealName: {
        color: 'white',
        fontSize: 20,
        fontWeight: 800,
    },
    macrosInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 70,
        paddingVertical: 5,
    },
    mealList: {
        borderRadius: 10,
    }
});