import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { formatName } from './formatter';

const createEmptyDay = (date) => ({
  date,
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  },
});

const MealContext = createContext();

export const MealProvider = ({children}) => {
    function getTodaysDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`; // Example: "2025-08-07"
    }

    const today = getTodaysDate();
    const mealNames = ["breakfast", "lunch", "dinner", "snack"];

    const initialMeals = {
        [today]: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: [],
        },
    };

    const initialRecentMeals = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
    };

    const [meals, setMeals] = useState(initialMeals);
    const [recentlyEaten, setRecentlyEaten] = useState(initialRecentMeals);

    // load meals data
    useEffect(() => {
        const loadMeals = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('@meals');
                if (jsonValue != null) {
                    setMeals(JSON.parse(jsonValue));
                }
            } catch (e) {
                console.error('Error loading meals: ', e);
            }
        };
        loadMeals();

        const loadRecentlyEaten = async () => {
            try {
                console.log("loading recentlyEaten");
                const jsonValue = await AsyncStorage.getItem('@recentlyEaten');
                if (jsonValue) {
                    setRecentlyEaten(JSON.parse(jsonValue));
                }
            } catch (e) {
                console.log('Error loading recentlyEaten: ', e);
            }
        }
        loadRecentlyEaten();
    }, []);

    // save meals data
    useEffect(() => {
        const saveMeals = async () => {
            try {
                const jsonValue = JSON.stringify(meals);
                await AsyncStorage.setItem('@meals', jsonValue);
            } catch (e) {
                console.error('Error saving meals: ', e);
            }
        };
        saveMeals();
    }, [meals]);

    useEffect(() => {
        const saveRecentlyEaten = async () => {
            try {
                console.log("saving recently Eaten: ", recentlyEaten);
                const jsonValue = JSON.stringify(recentlyEaten);
                await AsyncStorage.setItem('@recentlyEaten', jsonValue);
            } catch (e) {
                console.error('Error saving recentlyEaten: ', e);
            }
        };
        saveRecentlyEaten();
    }, [recentlyEaten]);

    const getNutrientFromCode = (foodItem, nutrientCode) => {
        const value = foodItem.foodnutrient.find(n =>
            n.nutrient?.number === nutrientCode.toString()
        );
        return value ? value.amount : "N/A";
    }

    const getNutrientObjectFromName = (foodItem, nutrientName) => {
        const object = {
            "calories": 208,
            "totalfat": 204,
            "saturatedfat": 606,
            "transfat": 605,
            "cholesterol": 601,
            "sodium": 307,
            "totalcarbohydrate": 205,
            "dietaryfiber": 291,
            "totalsugars": 269,
            "addedsugars": 539,
            "protein": 203,
            "vitamind": 324,
            "calcium": 301,
            "iron": 303,
            "potassium": 306
        }
        const value = foodItem.foodnutrient.find(n =>
            n.nutrient?.number === object[nutrientName.toLowerCase()].toString()
        );
        return value;
    }

    function getLabelNutrients(foodItem, nutrientName) {
        return foodItem.labelnutrients[0][nutrientName];
    }

    const addFoodItem = (date, mealName, item, servings) => {
        mealName = mealName.toLowerCase();

        const timeAdded = Date.now();
        const wrappedItem = { item, servings, timeAdded };

        if (mealNames.includes(mealName)) {
            setMeals((prev) => {
                const dayMeals = prev[date] || {
                    breakfast: [],
                    lunch: [],
                    dinner: [],
                    snack: [],
                };

                return {
                    ...prev,
                    [date]: {
                        ...dayMeals,
                        [mealName]: [...(dayMeals[mealName] || []), wrappedItem],
                    },
                };
            });

            // add to userData recentlyEaten
            // removes items that were added the longest ago, onces it hits the sizeLimit
            setRecentlyEaten(prev => {
                const sizeLimit = 100; // change to your limit
                
                // 1. Append new item to the correct meal array
                
                // remove item from list if already in it:
                const mealArray = prev[mealName].filter(item => item.item.gtinUpc != wrappedItem.item.gtinUpc);
                const updatedMealArray = [...(mealArray || []), wrappedItem];
                const updated = {
                    ...prev,
                    [mealName]: updatedMealArray
                };

                // 2. Flatten into { mealName, ...item } so we keep track of which meal each item belongs to
                const allItems = Object.entries(updated).flatMap(([key, items]) =>
                    items.map(item => ({ mealName: key, ...item }))
                );

                // 3. If over limit, remove oldest by timeAdded
                if (allItems.length > sizeLimit) {
                    // Sort oldest → newest
                    allItems.sort((a, b) => a.timeAdded - b.timeAdded);

                    // Keep only the newest N
                    const trimmedItems = allItems.slice(allItems.length - sizeLimit);

                    console.log("trimmedItems: ", trimmedItems);

                    // 4. Redistribute items back into mealName keys (removing the temp mealName field)
                    const redistributed = Object.keys(updated).reduce((acc, key) => {
                        console.log("acc: ", acc, ", key: ", key);
                        acc[key] = trimmedItems
                            .filter(item => item.mealName === key)
                            .map(({ mealName, ...rest }) => rest);
                        return acc;
                    }, {});

                    return redistributed;
                }

                return updated;
            });
        } else {
            console.log("meal not in list: ", mealName);
        }
    };

    useEffect(() => {
        console.log("recently Eaten: ", recentlyEaten);
    }, [recentlyEaten]);

    const addMultipleFoodItems = (date, mealName, items) => {
        items.forEach(function(item, index) {
            addFoodItem(date, mealName, item, 1);
        });
    }

    const editFoodItem = (date, mealName, item, index, servings) => {
        mealName = mealName.toLowerCase();

        const wrappedItem = { item, servings };

        setMeals((prev) => {
            const dayMeals = prev[date];
            if (!dayMeals) return prev;

            const mealItems = [...(dayMeals[mealName] || [])];

            if (index >= 0 && index < mealItems.length) {
                mealItems[index] = wrappedItem;
            } else {
                mealItems.push(wrappedItem);
            }

            return {
                ...prev,
                [date]: {
                    ...dayMeals,
                    [mealName]: mealItems,
                },
            };
        });
    };


    const removeFoodItem = (date, mealName, index) => {
        mealName = mealName.toLowerCase();

        setMeals((prev) => {
            const dayMeals = prev[date];
            if (!dayMeals) return prev;

            const mealItems = [...(dayMeals[mealName] || [])];
            mealItems.splice(index, 1);

            return {
                ...prev,
                [date]: {
                    ...dayMeals,
                    [mealName]: mealItems,
                },
            };
        });
    };

    function parseHouseholdServingFullText(householdServingFullText) {
        const match = householdServingFullText.trim().match(/^([\d.]+)\s*(.*)$/);
        if (!match) return [null, householdServingFullText];
        
        const number = parseFloat(match[1]);
        const text = formatName(match[2].trim());
        return [number, text];
    }


    return (
        <MealContext.Provider value={{ meals, mealNames, addFoodItem, addMultipleFoodItems, editFoodItem, removeFoodItem, getTodaysDate, getNutrientFromCode, getNutrientObjectFromName, getLabelNutrients, parseHouseholdServingFullText, recentlyEaten, setRecentlyEaten }}>
            {children}
        </MealContext.Provider>
    );
};

export const useMeals = () => useContext(MealContext);

/*
structure:

[
    name: string,
    brandName: string,
    servingSize: float
    servingSizeUnit: string
    calories: int
    nutrition: {
        "iron": { "value": 0, "unit": "g" },
        "sodium": { "value": 0, "unit": "g" },
        "calcium": { "value": 0, "unit": "g" },
        "protein": { "value": 0, "unit": "g" },
        "totalFat": { "value": 0, "unit": "g" },
        "transFat": { "value": 0, "unit": "g" },
        "vitaminD": { "value": 0, "unit": "g" },
        "potassium": { "value": 0, "unit": "g" },
        "addedSugars": { "value": 0, "unit": "g" },
        "cholesterol": { "value": 0, "unit": "g" },
        "totalSugars": { "value": 0, "unit": "g" },
        "dietaryFiber": { "value": 0, "unit": "g" },
        "saturatedFat": { "value": 0, "unit": "g" },
        "totalCarbohydrate": { "value": 0, "unit": "g" }
    }
    ingredients:
    barcode: 
]


*/