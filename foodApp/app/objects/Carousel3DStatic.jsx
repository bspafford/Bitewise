import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet
} from 'react-native';

import { useMeals } from '../data/mealData';
import { useData } from '../data/userData';
import ArcProgressBar from './arcProgressBar';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 200;
const ITEM_SPACING = 0//(width - ITEM_WIDTH) / 2;

export default function Carousel3DStatic({date}) {
    const { meals, getNutrientObjectFromName } = useMeals();
    const { calcMaxDailyCalories } = useData();
    const [totalMacros, setTotalMacros] = useState({calories: 0, protein: 0, carbs: 0, fats: 0,});
    
    useEffect(() => {
        if (meals || !Object.values(meals[date]).flat().length == 0) {
            const newTotals = Object.values(meals[date]).flat().reduce(
                (acc, entry) => {
                    const foodItem = entry.item; // fallback if no wrapper

                    const servings = entry.servings; // default to 1 if undefined
                    acc.calories += Number(getNutrientObjectFromName(foodItem, "calories").amount || 0) * servings;
                    acc.protein  += Number(getNutrientObjectFromName(foodItem, "protein").amount || 0) * servings;
                    acc.carbs    += Number(getNutrientObjectFromName(foodItem, "totalCarbohydrate").amount || 0) * servings;
                    acc.fats     += Number(getNutrientObjectFromName(foodItem, "totalFat").amount || 0) * servings;

                    return acc;
                },
                { calories: 0, protein: 0, carbs: 0, fats: 0 }
            );
            setTotalMacros(newTotals);
        }
    }, [meals]);

    const scrollX = useRef(new Animated.Value(0)).current;

    const names = ['calories', 'protein', 'carbs', 'fats'];
    const colors = ["#ff7e5f", "#DA22FF", '#87CEFA', '#98FB98', '#d5d808ff', '#ff9900ff', '#fb98c6ff', '#db3939ff'];
    
    const totalCalories = calcMaxDailyCalories();
    const maxes = [totalCalories, totalCalories * .35 / 4, totalCalories * .45 / 4, totalCalories * .2 / 9];
    const measurements = ['', 'g', 'g', 'g'];

    const children = ['#FFB6C1', '#87CEFA', '#98FB98', '#FFD700'].map(
        (color, index) => {
        const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
        });

        const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [20, 0, 20],
            extrapolate: 'clamp',
        });

        const grayscale = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4], // Lower opacity simulates B&W
            extrapolate: 'clamp',
        });

        return (
            <Animated.View
            key={index}
            style={[
                styles.item,
                {
                transform: [{ scale }, { translateY }],
                opacity: grayscale, // Apply visual "gray-out"
                },
            ]}
            >
                <ArcProgressBar value={totalMacros[names[index]]} total={maxes[index]} name={names[index]} colors={[colors[index * 2], colors[index * 2 + 1]]} measurement={measurements[index]}></ArcProgressBar>
            </Animated.View>
        );
        }
    );

    return (
        <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: ITEM_SPACING, minWidth: ITEM_WIDTH * 4 + width - ITEM_WIDTH * 1.5 }} // ITEM_WIDTH * 4 + width - ITEM_WIDTH
            scrollEventThrottle={16}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
            )}
            style={[{paddingLeft: width / 2 - ITEM_WIDTH / 2, paddingTop: 30 }]}
        >
            {children}
        </Animated.ScrollView>
    );
}

const styles = StyleSheet.create({
    item: {
        width: ITEM_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
});
