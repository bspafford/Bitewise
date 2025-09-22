import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useMeals } from '../data/mealData';
import { useData } from '../data/userData';
import ArcProgressBar from './arcProgressBar';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 200;
const ITEM_SPACING = 0//(width - ITEM_WIDTH) / 2;

export default function NutrientProgress({date}) {
    const { meals, getLabelNutrients } = useMeals();
    const { userData, calcMaxDailyCalories, getCurrWeight } = useData();
    const [totalMacros, setTotalMacros] = useState({calories: 0, protein: 0, carbs: 0, fats: 0,});

    useEffect(() => {
        if (meals && meals[date] && !Object.values(meals[date]).flat().length == 0) {
            const newTotals = Object.values(meals[date]).flat().reduce(
                (acc, entry) => {
                    const foodItem = entry.item; // fallback if no wrapper
                    const servings = entry.servings; // default to 1 if undefined
                    acc.calories += Number(getLabelNutrients(foodItem, "calories") || 0) * servings;
                    acc.protein  += Number(getLabelNutrients(foodItem, "protein") || 0) * servings;
                    acc.carbs    += Number(getLabelNutrients(foodItem, "carbohydrates") || 0) * servings;
                    acc.fats     += Number(getLabelNutrients(foodItem, "fat") || 0) * servings;
                    return acc;
                },
                { calories: 0, protein: 0, carbs: 0, fats: 0 }
            );
            setTotalMacros(newTotals);
        } else {
            setTotalMacros({ calories: 0, protein: 0, carbs: 0, fats: 0 });
        }
    }, [meals]);

    const names = ['calories', 'protein', 'carbs', 'fats'];
    const colors = ["#ff7e5f", "#DA22FF", '#87CEFA', '#98FB98', '#d5d808ff', '#ff9900ff', '#fb98c6ff', '#db3939ff'];
    
    const totalCalories = calcMaxDailyCalories();
    const dailyProtein = userData.weightUnit == 'lbs' ? getCurrWeight() : getCurrWeight() * 2.205;
    const dailyFat = totalCalories * .25 / 9; // cutting: ~20-25%, bulking: ~25-30% of calories
    const dailyCarbs = (totalCalories - dailyProtein * 4 - dailyFat * 9) / 4; // fill in rest with carbs 2-3g building, 1-2 cutting carbs per lb bodyweight
    const maxes = [totalCalories, dailyProtein, dailyCarbs, dailyFat];
    const measurements = ['', 'g', 'g', 'g'];

    return (
        <View style={styles.container}>
            <View
                style={[styles.item]}
            >
                <ArcProgressBar value={totalMacros[names[0]]} total={maxes[0]} name={names[0]} colors={[colors[0], colors[1]]} measurement={measurements[0]}></ArcProgressBar>
            </View>
            <View style={styles.macroBox}>
                <View style={styles.macroView}>
                    <Text style={{color: '#888'}}>Protein</Text>
                    <View style={styles.macroItem}>
                        <View style={[styles.progressBar, {width: `${totalMacros.protein / maxes[1] * 100}%`}]}>
                            <LinearGradient
                                colors={['#87CEFA', '#98FB98']} // start color to end color
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1 / (totalMacros.protein / maxes[1]), y: 0 }}
                                style={[{ width: `${1 * 100}%`, height: '100%', borderRadius: 10 }]}
                            />
                        </View>
                    </View>
                    <Text style={styles.macroValueText}>{totalMacros.protein.toFixed(0)} / {maxes[1].toFixed(0)}g</Text>
                </View>
                <View style={styles.macroView}>
                    <Text style={{color: '#888'}}>Carbs</Text>
                    <View style={[styles.macroItem, {marginVertical: 5}]}>
                        <View style={[styles.progressBar, {width: `${totalMacros.carbs / maxes[2] * 100}%`}]}>
                            <LinearGradient
                                colors={['#d5d808ff', '#ff9900ff']} // start color to end color
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1 / (totalMacros.carbs / maxes[2]), y: 0 }}
                                style={[{ width: `${1 * 100}%`, height: '100%', borderRadius: 10 }]}
                            />
                        </View>
                    </View>
                    <Text style={styles.macroValueText}>{totalMacros.carbs.toFixed(0)} / {maxes[2].toFixed(0)}g</Text>
                </View>
                <View style={styles.macroView}>
                    <Text style={{color: '#888'}}>Fat</Text>
                    <View style={[styles.macroItem, {marginVertical: 5}]}>
                        <View style={[styles.progressBar, {width: `${totalMacros.fats / maxes[3] * 100}%`}]}>
                            <LinearGradient
                                colors={['#fb98c6ff', '#db3939ff']} // start color to end color
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1 / (totalMacros.fats / maxes[3]), y: 0 }}
                                style={[{ width: `${1 * 100}%`, height: '100%', borderRadius: 10 }]}
                            />
                        </View>
                    </View>
                    <Text style={styles.macroValueText}>{totalMacros.fats.toFixed(0)} / {maxes[3].toFixed(0)}g</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    macroBox: {
        flexDirection: 'row',
        gap: '5%',
        paddingVertical: 20,
        paddingHorizontal: 30,
    },
    macroView: {
        flex: 1,
        alignItems: 'center',
    },
    macroItem: {
        width: '100%',
        borderRadius: 500,
        backgroundColor: '#444',
        height: 8,
        marginVertical: 5,
        overflow: 'hidden'
    },
    progressBar: {
        backgroundColor: 'white',
        height: '100%',
        borderRadius: 500,
    },
    macroValueText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    }
});
