import { IconSymbol } from '@/components/ui/IconSymbol';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useData } from '../data/userData';
import Q1 from './q1';
import Q2 from './q2';
import Q3 from './q3';
import Q4 from './q4';
import Results from './results';

export default function Questions() {
    const { userData, setInitialUserData, calcMaxDailyCalories } = useData();

    const navigation = useNavigation();
    
    const [keyboardActive, setKeyboardActive] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const buttonBottomAnim = useRef(new Animated.Value(50)).current;
    const scrollRef = useRef();
    const weightInputRef = useRef(null);
    const buttonHeight = 60;

    const [questionNum, setQuestionNum] = useState(1);

    const [dailyCalories, setDailyCalories] = useState(0);

    // q1
    const currentYear = new Date().getFullYear();
    const [selectedDay, setSelectedDay] = useState('1');
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [weightText, setWeightText] = useState("");
    const [weightUnit, setWeightUnit] = useState("lbs");
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

    // q2
    const [selectedFeet, setSelectedFeet] = useState('5');
    const [selectedInches, setSelectedInches] = useState('9');
    const [selectedGender, setSelectedGender] = useState('');

    // q3
    const [selectedActivityLevel, setSelectedActivityLevel] = useState(-1);

    // q4
    const [selectedGoal, setSelectedGoals] = useState(-1);

    function nextQuestion() {
        // check to see if negative age or old enough, prolly like 13+?
        // has to be like 50 punds up?

        Keyboard.dismiss();

        console.log(questionNum, selectedActivityLevel);

        if (weightText == "") {
            Alert.alert("Stop ✋", "You need to enter a weight!");
            return;
        } else if (parseFloat(weightText) < 50) {
            Alert.alert("Woah 😱", "That weight is too light!");
            return;
        } else if (questionNum == 2 && selectedGender == "") {
            Alert.alert("Stop ✋", "You gotta select a gender");
            return;
        } else if (questionNum == 3 && selectedActivityLevel == -1) {
            Alert.alert("What!?", "You have to be atleast somewhat active, you're alive aren't you?");
            return;
        } else if (questionNum == 4 && selectedGoal == -1) {
            Alert.alert("What!?", "You don't have a single goal? Why did you download this app?");
            return;
        }

        setQuestionNum(Math.min(questionNum + 1, 5)); // clamps at 5

        if (questionNum == 4) {
            // set user data and calc max calories
            setInitialUserData(selectedDay, selectedMonth, selectedYear, weightText, weightUnit, selectedFeet, selectedInches, selectedGender, selectedActivityLevel, selectedGoal);
        } else if (questionNum >= 5) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: '(tabs)' }],
                })
            );
        }
    }

    // sets calories after setInitialUserData useState is finished
    useEffect(() => {
        const calories = calcMaxDailyCalories();
        setDailyCalories(calories);
    }, [userData]);

    function previousQuestion() {
        setQuestionNum(Math.max(questionNum - 1, 1)); // clamps at 1
    }

    useEffect(() => {
        const onShow = Keyboard.addListener('keyboardWillShow', (event) => {
            setKeyboardHeight(event.endCoordinates.height);
            Animated.timing(buttonBottomAnim, {
                toValue: event.endCoordinates.height,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });

        const onHide = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardHeight(0);
            Animated.timing(buttonBottomAnim, {
                toValue: 50,
                duration: 300,
                useNativeDriver: false,
            }).start();
            scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
            })
        });

        return () => {
            onShow.remove();
            onHide.remove();
        };
    }, []);

    return (
        // age
        // weight
        
        // gender
        // height

        // activity level
        // goals
        <View style={styles.container}>
            <SafeAreaView style={{marginTop: 80, marginHorizontal: 50}}>
                <View style={styles.progressView}>
                    <View style={[styles.questionCircle, {borderColor: questionNum > 1 ? '#00da50ff' : 'white'}]}></View>
                    <View style={[styles.questionCircle, {borderColor: questionNum > 2 ? '#00da50ff' : 'white'}]}></View>
                    <View style={[styles.questionCircle, {borderColor: questionNum > 3 ? '#00da50ff' : 'white'}]}></View>
                    <View style={[styles.questionCircle, {borderColor: questionNum > 4 ? '#00da50ff' : 'white'}]}></View>
                </View>
            </SafeAreaView>
            {/* <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); setShowOptions(false);}} accessible={false}> */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
            >
                <SafeAreaView style={{marginHorizontal: 50}}>
                    {/* <View style={{opacity: .5, transform: [{translateX: 50}]}}> */}
                        {questionNum == 1 && <Q1 selectedDay={selectedDay} setSelectedDay={setSelectedDay} 
                                                selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                                                selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                                                weightText={weightText} setWeightText={setWeightText}
                                                weightUnit={weightUnit} setWeightUnit={setWeightUnit}></Q1>}
                    {/* </View> */}
                    {questionNum == 2 && <Q2 selectedFeet={selectedFeet} setSelectedFeet={setSelectedFeet}
                                            selectedInches={selectedInches} setSelectedInches={setSelectedInches}
                                            selectedGender={selectedGender} setSelectedGender={setSelectedGender}></Q2>}
                    {questionNum == 3 && <Q3 selectedActivityLevel={selectedActivityLevel} setSelectedActivityLevel={setSelectedActivityLevel}></Q3>}
                    {questionNum == 4 && <Q4 selectedGoal={selectedGoal} setSelectedGoals={setSelectedGoals}></Q4>}
                    {/* {questionNum >= 5 && <Results selectedDay={selectedDay}
                                                selectedMonth={selectedMonth}
                                                selectedYear={selectedYear}
                                                weightText={weightText}
                                                weightUnit={weightUnit}
                                                selectedFeet={selectedFeet}
                                                selectedInches={selectedInches}
                                                selectedGender={selectedGender}
                                                selectedActivityLevel={selectedActivityLevel}
                                                selectedGoal={selectedGoal}></Results>} */}
                        {questionNum >= 5 && <Results dailyCalories={dailyCalories} />}
                </SafeAreaView>
            {/* </TouchableWithoutFeedback> */}
            </KeyboardAvoidingView>
            <Animated.View style={[styles.submitButtonView, {bottom: buttonBottomAnim}]}>
                <Pressable onPress={previousQuestion} style={styles.backButton}>
                    <IconSymbol size={20} name={"arrow.backward"} color={'#00da50ff'} />
                </Pressable>
                <Pressable onPress={nextQuestion} style={styles.submitButton}>
                    <Text style={styles.submitText}>{questionNum >= 5 ? "Confirm" : "Next"}</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    question: {
        color: 'white',
        fontSize: 35,
        fontWeight: 'bold',
    },
    genderQuestion: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    genderButton: {
        width: '49%',
        aspectRatio: 1,
        borderRadius: 10,        
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
    },
    genderText: {
        color: 'white',
        fontSize: 30,
    },
    progressView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 30,
        gap: 10,
    },
    questionCircle: {
        borderColor: 'white',
        borderWidth: 3,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    questionNum: {
        color: 'white',
        padding: 15,
        fontWeight: 'bold',
        fontSize: 20,
        transform: [{translateY: '-16%'}]
    },
    hr: {
        flex: 1,
        borderBottomColor: 'white',
        borderBottomWidth: 2,
    },
    center: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    picker: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        overflow: 'hidden',
        paddingVertical: 20,
    },
    pickerSelected: {
        position: 'absolute',
        backgroundColor: '#ffffff30',
        width: '100%',
        height: '35',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonView: {
        alignItems: 'center',
        position: 'absolute',
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        bottom: 0,
        paddingHorizontal: 30,
        backgroundColor: 'black',
        padding: 10,
    },
    backButton: {
        borderRadius: 500,
        padding: 12,
        backgroundColor: '#004218ff'
    },
    submitButton: {
        width: '90%',
        backgroundColor: '#00da50ff',
        borderRadius: 500,
        alignItems: 'center',
    },
    submitText: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    },
    weightView: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
    },
    weightInput: {
        color: 'black',
        fontSize: 25,
        backgroundColor: 'white',
        paddingVertical: 5,
        borderRadius: 5,
        flex: 1,
        textAlign: 'right',
    },
    weightUnit: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 5,
        padding: 10,
        gap: 5,
    },
    multipleChoiceBox: {
        backgroundColor: '#222',
        padding: 15,
        borderRadius: 10,
        width: '90%',
    },
    multipleChoiceTitle: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    },
    multipleChoiceDescription: {
        color: 'white',
        fontSize: 15,
    },
})