import { IconSymbol } from '@/components/ui/IconSymbol';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { Animated, Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import WheelPicker from '../objects/wheelPicker';

export default function Questions() {
    const [questionNum, setQuestionNum] = useState(1);
    const navigation = useNavigation();
    
    // question 1
    const currentYear = new Date().getFullYear();
    const [selectedDay, setSelectedDay] = useState('1');
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const years = Array.from({ length: 150 }, (_, i) =>
        (currentYear - i).toString()
    ); // From current year back 150 years

    // question 2
    const [weightText, setWeightText] = useState(1);
    const [showOptions, setShowOptions] = useState(false);
    const [weightUnit, setWeightUnit] = useState("lbs");

    // question 3
    const [selectedFeet, setSelectedFeet] = useState('5');
    const [selectedInches, setSelectedInches] = useState('9');
    const feet = Array.from({length: 7}, (_, i) => (i + 3).toString());
    const inches = Array.from({length: 11}, (_, i) => (i + 1).toString());

    // question 5
    const activityLevels = ["Not Very Active", "Lightly Active", "Active", "Very Active"];
    const [selectedActivityLevel, setSelectedActivityLevel] = useState(0);
    const activityLevelAnims = useRef(activityLevels.map(() => new Animated.Value(0))).current;
    const activityBorderWidths = activityLevelAnims.map(anim =>
        anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 3],
        })
    );
    const activityBorderColors = activityLevelAnims.map(anim =>
        anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#bbb', '#fff'],
        })
    );
    function setActivityLevel(index) {
        setSelectedActivityLevel(index);
        Animated.timing(activityLevelAnims[index], {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
        activityLevelAnims.forEach((anim, i) => {
            if (i != index) {
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
        });
    }

    // question 6
    const goals = ["Lose Weight", "Maintain Weight", "Gain Weight"];
    const [selectedGoals, setSelectedGoals] = useState(0);
    const goalAnims = useRef(goals.map(() => new Animated.Value(0))).current;
    const goalBorderWidths = goalAnims.map(anim =>
        anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 3],
        })
    );
    const goalBorderColors = goalAnims.map(anim =>
        anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#bbb', '#fff'],
        })
    );
    function setGoals(index) {
        setSelectedGoals(index);
        Animated.timing(goalAnims[index], {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
        goalAnims.forEach((anim, i) => {
            if (i != index) {
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
        });
    }

    function nextQuestion() {
        setQuestionNum(questionNum + 1);

        if (questionNum == 1) {// DOB
            // check to see if negative age or old enough, prolly like 13+?


        } else if (questionNum == 2) { // Weight
            // has to be like 50 punds up?
        } else if (questionNum == 3) { // Height
            // already validated prolly
        } else if (questionNum == 4) {
            // two options, can't really mess that up
        } else if (questionNum == 5) {
            // multiple choice, all good
        } else if (questionNum >= 6) { // Finished all questions
            // multiple choice, all good
            // calc calories n stuff
            

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: '(tabs)' }],
                })
            );
        }
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); setShowOptions(false);}} accessible={false}>
                <SafeAreaView style={{marginVertical: 80, marginHorizontal: 50, height: '100%'}}>
                    <View style={styles.progressView}>
                        <View style={styles.questionCircle}>
                            <Text style={styles.questionNum}>1</Text>
                        </View>
                        <View style={styles.hr}></View>
                        <View style={styles.questionCircle}>
                            <Text style={styles.questionNum}>2</Text>
                        </View>
                        <View style={styles.hr}></View>
                        <View style={styles.questionCircle}>
                            <Text style={styles.questionNum}>3</Text>
                        </View>
                        <View style={styles.hr}></View>
                        <View style={styles.questionCircle}>
                            <Text style={styles.questionNum}>4</Text>
                        </View>
                    </View>

                    {questionNum == 1 && <View>
                        <Text style={[styles.question]}>When were you born?</Text>
                    </View>
                    }

                    {questionNum == 2 && <View>
                        <Text style={[styles.question]}>How much do you weigh?</Text>
                    </View>}
                    
                    {questionNum == 3 && <View>
                    <Text style={[styles.question]}>How tall are you?</Text>
                    </View>}
                    
                    {questionNum == 4 && <View>
                        <Text style={[styles.question]}>What's your gender?</Text>
                    </View>}

                    {questionNum == 5 && <View>
                        <Text style={[styles.question]}>How active are you?</Text>
                    </View>}

                    {questionNum == 6 && <View>
                        <Text style={[styles.question]}>What are your weight and muscle goals?</Text>
                    </View>}
                    
                    {/* <Link href="test" style={[{ padding: 50 }]} asChild><Pressable><Text style={[{ color: 'white', fontSize: 30 }]}>test</Text></Pressable></Link> */}
                </SafeAreaView>
            </TouchableWithoutFeedback>

                    {questionNum == 1 && <View style={styles.picker}>
                        <View style={styles.pickerSelected}></View>
                        <View style={styles.pickerView}>
                            <WheelPicker setSelected={setSelectedMonth} list={months}></WheelPicker>
                            <WheelPicker setSelected={setSelectedDay} list={days}></WheelPicker>
                            <WheelPicker setSelected={setSelectedYear} list={years}></WheelPicker>
                        </View>
                    </View>}
                    {questionNum == 2 && <View style={styles.center}>
                        <View style={styles.weightView}>
                            <TextInput
                                style={styles.weightInput}
                                placeholder=""
                                placeholderTextColor="gray"
                                value={weightText}
                                onChangeText={setWeightText}
                                keyboardType="numeric"
                            >
                            </TextInput>
                            <Pressable onPress={() => {setWeightUnit(weightUnit == "lbs" ? "kg" : "lbs")}} style={styles.weightUnit}>
                                <Text style={{color: 'white', fontSize: 20}}>{weightUnit}</Text>
                                <IconSymbol size={20} name={"chevron.down"} color={'#fff'} />
                                {/* <OptionsSelector showOptions={showOptions} setShowOptions={setShowOptions} /> */}
                            </Pressable>
                        </View>
                    </View>}
                    {questionNum == 3 && <View style={[styles.picker, {width: '70%'}]}>
                        <View style={styles.pickerSelected}>
                            <Text style={{position: 'absolute', fontSize: 20, color: 'white', left: '29%'}}>Feet</Text>
                            <Text style={{position: 'absolute', fontSize: 20, color: 'white', left: '79%'}}>Inch</Text>
                        </View>
                        <View style={styles.pickerView}>
                            <WheelPicker setSelected={setSelectedFeet} list={feet}></WheelPicker>
                            <WheelPicker setSelected={setSelectedInches} list={inches}></WheelPicker>
                        </View>
                    </View>}
                    {questionNum == 4 && <View style={styles.center}>
                        <View style={styles.genderQuestion}>
                            <Pressable style={[styles.genderButton, {backgroundColor: '#0671B7'}]}>
                                <IconSymbol size={100} name={"figure.stand"} color={'#ffffff'} />
                                <Text style={styles.genderText}>Male</Text>
                            </Pressable>
                            <Pressable style={[styles.genderButton, {backgroundColor: '#F8B7CD'}]}>
                                <IconSymbol size={100} name={"figure.stand.dress"} color={'#ffffff'} />
                                <Text style={styles.genderText}>Female</Text>
                            </Pressable>
                        </View>
                    </View>}
                    {questionNum == 5 && <View style={[styles.center, {flexDirection: 'column', gap: 10}]}>
                        {activityLevels.map((title, index) => (
                            <Animated.View style={[styles.multipleChoiceBox, {borderWidth: activityBorderWidths[index], borderColor: activityBorderColors[index]}]}>
                                <Pressable onPress={() => {setActivityLevel(index)}}>
                                    <Text style={styles.multipleChoiceTitle}>{title}</Text>
                                    <Text style={styles.multipleChoiceDescription}>this is the description of the choice</Text>
                                </Pressable>
                            </Animated.View>
                        ))}
                    </View>}
                    {questionNum == 6 && <View style={[styles.center, {flexDirection: 'column', gap: 10}]}>
                        {goals.map((title, index) => (
                            <Animated.View style={[styles.multipleChoiceBox, {borderWidth: goalBorderWidths[index], borderColor: goalBorderColors[index]}]}>
                                <Pressable onPress={() => {setGoals(index)}}>
                                    <Text style={styles.multipleChoiceTitle}>{title}</Text>
                                    <Text style={styles.multipleChoiceDescription}>this is the description of the choice</Text>
                                </Pressable>
                            </Animated.View>
                        ))}
                    </View>}
                    
                    <SafeAreaView style={styles.submitButtonView}>
                        <Pressable onPress={() => {nextQuestion()}} style={styles.submitButton}>
                            <Text style={styles.submitText}>{questionNum == 4 ? "Submit" : "Next"}</Text>
                        </Pressable>
                    </SafeAreaView>
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
    },
    questionCircle: {
        borderColor: 'white',
        borderWidth: 3,
        borderRadius: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        width: '90%',
        borderRadius: 5,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: '-50%'}, {translateY: '-50%'}],
    },
    picker: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        borderRadius: 5,
        overflow: 'hidden',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: '-50%'}, {translateY: '-50%'}],
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
        width: '100%',
        bottom: 50,
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
        width: '90%',
        gap: 10,
    },
    weightInput: {
        color: 'black',
        fontSize: 25,
        backgroundColor: 'white',
        padding: 5,
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