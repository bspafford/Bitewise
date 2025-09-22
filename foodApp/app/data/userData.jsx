import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const userContext = createContext();

const defaultData = {
    day: 0,
    month: 0,
    year: 0,
    startWeight: 0,
    weightList: {},
    weightUnit: "",
    feet: 0,
    inches: 0,
    gender: "",
    activityLevel: "",
    goal: "",
}

export const UserProvider = ({children}) => {
    const [userData, setUserData] = useState(defaultData);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [searchHistory, setSearchHistory] = useState(new Set([]));

    const monthToNumber = {
        january: 1,
        february: 2,
        march: 3,
        april: 4,
        may: 5,
        june: 6,
        july: 7,
        august: 8,
        september: 9,
        october: 10,
        november: 11,
        december: 12,
    };

    // load userData data
    useEffect(() => {
        const loadUserData = async () => {
            try {
                // load userData
                const jsonValue = await AsyncStorage.getItem('@userData');
                if (jsonValue != null) {
                    setUserData(JSON.parse(jsonValue));
                    setHasLoaded(true);
                }

                // load search history
                const searchHistoryJson = await AsyncStorage.getItem('@searchHistory');
                if (searchHistoryJson) {
                    const array = JSON.parse(searchHistoryJson);
                    console.log("loading search history: ", array);
                    setSearchHistory(new Set(array));
                }
            } catch (e) {
                console.error('Error loading userData:', e);
                setHasLoaded(true);
            }
        };
        loadUserData();
    }, []);

    // save userData data
    useEffect(() => {
        const saveUserData = async () => {
            try {
                const jsonValue = JSON.stringify(userData);
                await AsyncStorage.setItem('@userData', jsonValue);
            } catch (e) {
                console.error('Error saving userData: ', e);
            }
        };
        saveUserData();
    }, [userData, JSON.stringify(userData.weightList)]);

    useEffect(() => {
        if ([...searchHistory].length == 0) return; // doesn't save if nothing inside
        console.log("searchHistory saving: ", searchHistory);
        const saveSearchHistory = async () => {
            try {
                const array = [...searchHistory]; // convert to array
                await AsyncStorage.setItem('@searchHistory', JSON.stringify(array));
            } catch (e) {
                console.error('Error saving searchHistory: ', e);
            }
        };
        saveSearchHistory();
    }, [searchHistory]);

    function getTodaysDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`; // Example: "2025-08-07"
    }

    function setInitialUserData(day, month, year, weightText, weightUnit, feet, inches, gender, activityLevel, goal) {
        const data = defaultData;
        data.day = day;
        data.month = monthToNumber[month.toLowerCase()];
        data.year = year;
        data.startWeight = parseFloat(weightText);
        data.weightList[getTodaysDate()] = parseFloat(weightText);
        data.weightUnit = weightUnit;
        data.feet = feet;
        data.inches = inches;
        data.gender = gender;
        data.activityLevel = activityLevel;
        data.goal = goal;
        setUserData(data);
    }

    function calcMaxDailyCalories() {
        // convert weight to kg
        let kgWeight = userData.startWeight;
        if (userData.weightUnit == "lbs")
            kgWeight = kgWeight / 2.205;

        // convert height to cm
        const cmHeight = userData.feet * 30.48 + userData.inches * 2.54;

        // get age
        const birthDate = new Date(`${userData.year}-${userData.month}-${userData.day}`);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--; // birthday hasn't occurred yet this year
        }

        let c = 5;
        if (userData.gender == "Female")
            c = -161

        const calories = Math.round((10 * kgWeight) + (6.25 * cmHeight) - (5 * age) + c);

        return calories;
    }

    function getCurrWeight() {
        return Object.values(userData.weightList)[Object.keys(userData.weightList).length - 1];
    }

    return (
        <userContext.Provider value={{ userData, hasLoaded, setInitialUserData, calcMaxDailyCalories, getCurrWeight, setUserData, searchHistory, setSearchHistory }}>
            {children}
        </userContext.Provider>
    );
};

export const useData = () => useContext(userContext);