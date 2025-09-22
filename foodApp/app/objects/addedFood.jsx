import { IconSymbol } from '@/components/ui/IconSymbol';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
    Gesture,
    GestureDetector
} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle, useSharedValue, withTiming
} from 'react-native-reanimated';
import { formatName } from '../data/formatter';
import { useMeals } from '../data/mealData';

export default function AddedFood({food, date, meal, index}) {
    const { meals, removeFoodItem, getLabelNutrients, parseHouseholdServingFullText } = useMeals();
    
    const houseHoldServing = parseHouseholdServingFullText(food.item.householdServingFullText);

    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);
    
    function onDelete() {
        removeFoodItem(date, meal, index);
    }

    const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
        translateX.value = Math.min(0, e.translationX);
    })
    .onEnd(() => {
        if (translateX.value < -150) {
            // Swipe past threshold: animate out
            translateX.value = withTiming(-300, { duration: 150 });
            opacity.value = withTiming(0, { duration: 150 }, () => {
                runOnJS(onDelete)(food);
            });
        } else {
            // Not enough: snap back
            translateX.value = withTiming(0);
        }
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));
    
    const containerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        height: opacity.value === 0 ? 0 : undefined,
        overflow: 'hidden',
    }));

    const formatNumber = (num) => {
        return num.toFixed(1) % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
    }

    function truncate(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    return (
        <Animated.View style={[containerStyle]}>
            <View style={styles.deleteBackground}>
                <Text style={styles.deleteText}>Delete</Text>
            </View>
            <GestureDetector gesture={pan}>
                <Animated.View style={[{backgroundColor: '#222'}, animatedStyle]}>
                    <Link style={[{padding: 10}]} href={{
                        pathname: "../foodNutritionPage",
                        params: { food: JSON.stringify(food), date: date, meal: meal, index: index }
                    }} asChild>
                        <Pressable>
                            <View style={[{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                                <View>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.foodName}>{truncate(formatName(food.item.description), 20)}</Text>
                                    <Text style={styles.servingSize}>{food.servings != 1 ? (formatNumber(food.servings) + " x ") : ""}{houseHoldServing[0]} {houseHoldServing[1]} ({food.item.servingSize}{food.item.servingSizeUnit})</Text>
                                </View>
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20}}>
                                    <Text style={styles.calories}>{(getLabelNutrients(food.item, "calories") * food.servings).toFixed(0)}</Text>
                                    <IconSymbol size={12} name={"chevron.right"} color={'#fff'} />
                                </View>
                            </View>
                            <View style={[{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 70, paddingTop: 5}]}>
                                <Text style={styles.text}>{formatNumber(getLabelNutrients(food.item, "protein") * food.servings)}</Text>
                                <Text style={styles.text}>{formatNumber(getLabelNutrients(food.item, "carbohydrates") * food.servings)}</Text>
                                <Text style={styles.text}>{formatNumber(getLabelNutrients(food.item, "fat") * food.servings)}</Text>
                            </View>
                        </Pressable>
                    </Link>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
    },
    foodName: {
        color: 'white',
        fontSize: 20,
    },
    servingSize: {
        color: 'white',
        fontSize: 13,
    },
    calories: {
        color: 'white',
        fontSize: 20,
    },
    deleteBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 20,
        borderRadius: 8,
        zIndex: 0,
    },
    deleteText: {
        color: 'white',
        fontWeight: 'bold',
    },
});