import React, { useRef, useState } from 'react';
import { Animated, Button, Dimensions, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { formatName } from './data/formatter';
import { useMeals } from './data/mealData';
import NutrientBlock from "./objects/nutrientBlock";

const foodPage = () => {
    const { meals, addFoodItem, editFoodItem, getNutrientFromCode, getNutrientObjectFromName, parseHouseholdServingFullText } = useMeals();

    const navigation = useNavigation();

    const { food, date, meal, index = -1 } = useLocalSearchParams();
    const foodParsed = JSON.parse(food);
    const foodItem = foodParsed.item || foodParsed; // if no wrapper
    const screenWidth = Dimensions.get('window').width;
    const [isServingNumberFocused, setIsServingNumberFocused] = useState(false);
    const houseHoldServing = parseHouseholdServingFullText(foodItem.householdServingFullText);
    const [servingNumber, setServingNumber] = useState(foodParsed.servings ? houseHoldServing[0] * foodParsed.servings : (houseHoldServing[0] || 1));

    const [selected, setSelected] = useState(meal || 'Select Meal');
    const [showOptions, setShowOptions] = useState(false);
    const options = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const optionsAnim = useRef(new Animated.Value(0)).current;

    const [showSelectServingUnit, setShowSelectServingUnit] = useState(false);
    const selectServingUnitAnim = useRef(new Animated.Value(0)).current;

    const [hasPressedSave, setHasPressedSave] = useState(false);

    const optionsScale = optionsAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [.75, 1],
    })

    const selectServingUnitTranslate = selectServingUnitAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['100%', '0%'],
    })

    function saveFood() {
        if (selected == 'Select Meal') { // meal isn't selected
            setHasPressedSave(true);
            showMealMenu();
        } else {        
            // when click on popup bring it home
            // else go to home
            returnHome();
        }
    };

    function returnHome(option = "") {
        console.log("returning home!");

        let selectedMeal = selected;
        if (option != "")
            selectedMeal = option

        console.log(selectedMeal);
        console.log(foodItem);

        if (index != -1) { // editing food
            console.log("your editing the food item!");
            editFoodItem(date, selectedMeal, foodItem, index, servingNumber / houseHoldServing[0]);
        } else { // adding food
            console.log("adding food item!");
            console.log(date, ",", selectedMeal, ",", foodItem, ",");
            addFoodItem(date, selectedMeal, foodItem, servingNumber / houseHoldServing[0]);
        }

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: '(tabs)' }],
            })
        );
    }

    function showMealMenu() {
        setShowOptions(prev => !prev)
        optionsAnim.setValue(0);
        Animated.timing(optionsAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }

    function formatNumber(number) {
        return Math.round(number * 10) / 10 == Math.round(number) ? number.toFixed(0) : number.toFixed(1);
    }

    function getNutrientString(nutrientName) {
        return `${formatNumber(getLabelNutrients(nutrientName) * servingNumber / houseHoldServing[0] || 0)}${getNutrientObjectFromName(foodItem, nutrientName)?.nutrient.unitName.toLowerCase() || ''}`;
        // return "N/A" // return if not in json
    }

    function getLabelNutrients(nutrient) {
        // console.log("getlabelNutrients:", nutrient, ", asdf:", foodItem.labelnutrients);
        return foodItem.labelnutrients[0][nutrient];
    }

    function CustomHeader() {
        const navigation = useNavigation();

        return (
            <View style={{ backgroundColor: '#334', paddingTop: 40, paddingBottom: 10 }}>
            {/* Row 1: Back button, Title, Save */}
                <View style={{flexDirection: 'row', width: '100%', paddingHorizontal: 15, paddingTop: 10 }}>
                    <Pressable onPress={() => navigation.goBack()} style={{ position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                        <IconSymbol size={28} name={"chevron.left"} color={'#007AFF'} />
                        <Text style={styles.headerButton}>Back</Text>
                    </Pressable>
                    <View style={{left: '50%', transform: [{translateX: '-50%'}]}}>
                        <Pressable
                            onPress={showMealMenu}
                            style={styles.selector}
                        >
                            <View style={{ display: 'flex', paddingTop: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.selectorText}>{selected} </Text>
                                <IconSymbol size={10} name={"arrowtriangle.down.fill"} color={'#ffffff'} />
                            </View>
                        </Pressable>

                        {showOptions && (
                            <Animated.View style={[styles.dropdown, { transform: [{translateX: '-50%'}, {scale: optionsScale}], opacity: optionsAnim}]}>
                            {options.map((option, index) => (
                                <Pressable
                                key={option}
                                onPress={() => {
                                    setSelected(option);
                                    setShowOptions(false);
                                    if (hasPressedSave)
                                        returnHome(option);
                                }}
                                style={styles.option}
                                >
                                {index != 0 && <View style={[styles.hr, { width: '100%', borderBottomColor: '#555' }]}></View>}
                                <Text style={styles.optionsText}>{option}</Text>
                                </Pressable>
                            ))}
                            </Animated.View>
                        )}
                    </View>
                </View>

                {/* Row 2: Extra info or content */}
                <View style={{ marginTop: 8, paddingHorizontal: 15 }}>
                    
                </View>
            </View>
        );
    }

    return (
    <View style={styles.container}>
        <Stack.Screen options={{ 
            header: () => <CustomHeader />,
        }}></Stack.Screen>
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{backgroundColor: '#334'}}>
                <View style={{padding: 10, backgroundColor: '#334'}}>
                    <Text style={styles.foodName}>{formatName(foodItem.description)}</Text>
                    <Text style={styles.brandName}>{formatName(foodItem.brandOwner)}</Text>
                </View>
                <View style={[{ backgroundColor: 'black', display: 'flex', alignItems: 'center' }]}>
                    <View style={styles.inputView}>
                        <View style={styles.horizontalView}>
                            <IconSymbol size={28} name={"number"} color={'#ffffff'} />
                            <TextInput
                                style={styles.servingsInput}
                                placeholder={isServingNumberFocused ? '' : `${servingNumber}`}
                                placeholderTextColor="white"
                                keyboardType="numeric"
                                onFocus={() => {setIsServingNumberFocused(true)}}
                                onBlur={() => {setIsServingNumberFocused(false)}}
                                value={servingNumber}
                                onChangeText={setServingNumber}
                            />
                        </View>
                        <View style={styles.horizontalView}>
                            <IconSymbol size={28} name={"line.horizontal.3.decrease"} color={'#ffffff'} />
                            <Pressable
                                onPress={() => {
                                    setShowSelectServingUnit(true);
                                    selectServingUnitAnim.setValue(0);
                                    Animated.timing(selectServingUnitAnim, {
                                        toValue: 1,
                                        duration: 300,
                                        useNativeDriver: false,
                                    }).start();
                                }}
                                style={{flex: 1}}
                            >
                                <View style={styles.servingsInput}>
                                    <Text style={styles.selectorText}>{houseHoldServing[0]} {houseHoldServing[1]}</Text>
                                </View>
                            </Pressable>
                        </View>
                        <Pressable style={styles.saveButton} onPress={saveFood}>
                            <Text style={styles.saveText}>Save</Text>
                        </Pressable>
                    </View>
                    <View style={styles.nutritionLabel}>
                        <Text style={[styles.text, { fontSize: screenWidth * 0.13, fontWeight: 800 }]}>Nutrition Facts</Text>
                        <View style={styles.hr}></View>
                        <View style={styles.nutrientView}>
                            <Text style={[styles.text, { fontSize: 22, fontWeight: 800 }]}>Serving size</Text>
                            <Text style={[styles.text, { fontSize: 22, fontWeight: 800 }]}>{foodItem["servingSize"]}{foodItem["servingSizeUnit"]} (0g)</Text>
                        </View>
                        <View style={[styles.hr, {borderBottomWidth: 15 }]}></View>
                        <View style={styles.nutrientView}>
                            <View>
                                <Text style={[styles.text, { fontSize: 18, fontWeight: 800 }]}>Amount per serving</Text>
                                <Text style={[styles.text, { fontSize: 40, fontWeight: 800 }]}>Calories</Text>
                            </View>
                            <Text style={[styles.text, {fontSize: 55, fontWeight: 800 }]}>{(getLabelNutrients("calories") * servingNumber / houseHoldServing[0]).toFixed(0)}</Text>
                        </View>
                        <View style={[styles.hr, { borderBottomWidth: 7 }]}></View>
                        <View style={[{ width: '100%', alignItems: 'flex-end' }]}>
                            <Text style={styles.text}>% Daily Value*</Text>
                        </View>
                        <NutrientBlock name="Total Fat" amount={getNutrientString("totalFat")} percent={0} />
                        <NutrientBlock name="   Saturated Fat" amount={getNutrientString("saturatedFat")} percent={5} fontWeight={400} />
                        <NutrientBlock name="   Trans Fat" amount={getNutrientString("transFat")} percent={15} fontWeight={400} />
                        <NutrientBlock name="Cholesterol" amount={getNutrientString("cholesterol")} percent={15} />
                        <NutrientBlock name="Sodium" amount={getNutrientString("sodium")} percent={15} />
                        <NutrientBlock name="Total Carbohydrate" amount={getNutrientString("totalCarbohydrate")} percent={15} />
                        <NutrientBlock name="   Dietary Fiber" amount={getNutrientString("dietaryFiber")} percent={15} fontWeight={400} />
                        <NutrientBlock name="   Total Sugars" amount={getNutrientString("totalSugars")} percent={15} fontWeight={400} />
                        <NutrientBlock name={`       Includes ${getNutrientString("addedSugars")} Added Sugars`} percent={15} fontWeight={400} />
                        <NutrientBlock name="Protein" amount={getNutrientString("protein")} percent={15} />
                        <View style={[styles.hr, {borderBottomWidth: 15 }]}></View>
                        <NutrientBlock name="Vitamin D" amount={getNutrientString("vitaminD")} percent={15} fontWeight={400} />
                        <NutrientBlock name="Calcium" amount={getNutrientString("calcium")} percent={15} fontWeight={400} />
                        <NutrientBlock name="Iron" amount={getNutrientString("iron")} percent={15} fontWeight={400} />
                        <NutrientBlock name="Potassium" amount={getNutrientString("potassium")} percent={15} fontWeight={400} />
                        <View style={[styles.hr, { borderBottomWidth: 7 }]}></View>
                        <Text style={styles.text}>* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</Text>
                    </View>
                </View>
            </ScrollView>
            { showSelectServingUnit && <View style={{position: 'absolute', width: '100%', height: '100%'}}>
                <Animated.View style={{flex: 1, opacity: selectServingUnitAnim}}>
                    <Pressable style={{width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onPress={() => setShowSelectServingUnit(false)} />
                </Animated.View>
                <Animated.View style={[styles.selectServingUnitView, {transform: [{translateY: selectServingUnitTranslate}]}]}>
                    <Button title='Cancel' onPress={() => setShowSelectServingUnit(false)}/>
                    <View></View>
                </Animated.View>
            </View> }
        </SafeAreaView>
    </View>
    )
}

export default foodPage

const styles = StyleSheet.create({
    container: {
        
    },
    hr: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 5,
    },
    foodName: {
        color: 'white',
        fontSize: 40,
        fontWeight: 800,
    },
    brandName: {
        color: '#ccc',
        fontSize: 20,
    },
    text: {
        color: 'white',
        fontSize: 18,
    },
    nutritionLabel: {
        width: '95%',
        paddingTop: 30,
    },
    nutrientView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nutrientText: {
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
    },
    headerButton: {
        color: '#007AFF', 
        fontSize: 16,
    },
    selectorText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    dropdown: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222',
        width: 200,
        borderRadius: 10,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // For Android compatibility with older versions

        left: '50%',
        top: '100%',
        marginTop: 10,
    },
    option: {
        width: '100%',
        alignItems: 'center',
        padding: 3,
    },
    optionsText: {
        color: 'white',
        fontSize: 20,
        paddingTop: 3,
    },
    horizontalView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 10,
    },
    inputView: {
        paddingTop: 10,
        width: '90%',
        gap: 7,
    },
    servingsInput: {
        flex: 1,
        backgroundColor: '#334',
        fontSize: 24,
        borderRadius: 5,
        paddingVertical: 5,
		paddingHorizontal: 10,
        color: 'white',
    },
    saveButton: {
        width: '100%',
        backgroundColor: 'green',
        borderRadius: 5,
        padding: 8,
    },
    saveText: {
        fontSize: 20,
        color: 'white',
        width: '100%',
        textAlign: 'center',
    },
    selectServingUnitView: {
        // position: 'absolute',
        backgroundColor: 'white',
        width: '100%',
        height: 300,
    }
});