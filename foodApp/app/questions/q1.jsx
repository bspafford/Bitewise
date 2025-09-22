import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRef, useState } from 'react';
import { findNodeHandle, Pressable, ScrollView, StyleSheet, Text, TextInput, UIManager, View } from 'react-native';
import WheelPicker from '../objects/wheelPicker';

export default function Q1({selectedDay, setSelectedDay, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, weightText, setWeightText, weightUnit, setWeightUnit}) {
    const [keyboardActive, setKeyboardActive] = useState(false);
    const scrollRef = useRef();
    const weightInputRef = useRef(null);
    const buttonHeight = 60;

    const [questionNum, setQuestionNum] = useState(1);

    // question 1
    const currentYear = new Date().getFullYear();
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const years = Array.from({ length: 150 }, (_, i) =>
        (currentYear - i - 13).toString()
    ); // From current year back 150 years

    return (
        <View>
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: buttonHeight },
                ]}
                keyboardShouldPersistTaps="handled"
                bounces={keyboardActive}
            >
                <View>
                    <Text style={[styles.question]}>When were you born?</Text>
                </View>
                <View style={styles.picker}>
                    <View style={styles.pickerSelected}></View>
                    <View style={styles.pickerView}>
                        <WheelPicker selected={selectedMonth} setSelected={setSelectedMonth} list={months}></WheelPicker>
                        <WheelPicker selected={selectedDay} setSelected={setSelectedDay} list={days}></WheelPicker>
                        <WheelPicker selected={selectedYear} setSelected={setSelectedYear} list={years}></WheelPicker>
                    </View>
                </View>
                <View>
                    <Text style={[styles.question, {paddingTop: 30}]}>How much do you weigh?</Text>
                </View>
                <View style={styles.center}>
                    <View style={styles.weightView}>
                        <TextInput
                            ref={weightInputRef}
                            style={styles.weightInput}
                            placeholder=""
                            placeholderTextColor="gray"
                            value={weightText}
                            onChangeText={setWeightText}
                            keyboardType="numeric"
                            onFocus={() => {setKeyboardActive(true);
                                setTimeout(() => {
                                    const inputHandle = findNodeHandle(weightInputRef.current);
                                    const scrollHandle = findNodeHandle(scrollRef.current);

                                    if (inputHandle && scrollHandle) {
                                    UIManager.measureLayout(
                                        inputHandle,
                                        scrollHandle,
                                        () => {
                                        console.warn('Could not measure layout');
                                        },
                                        (x, y) => {
                                        scrollRef.current?.scrollTo({ y: y - 100, animated: true }); // adjust offset if needed
                                        }
                                    );
                                    }
                                }, 10);
                            }}
                            onBlur={() => {setKeyboardActive(false)}}
                        >
                        </TextInput>
                        <Pressable onPress={() => {setWeightUnit(weightUnit == "lbs" ? "kg" : "lbs")}} style={styles.weightUnit}>
                            <Text style={{color: 'white', fontSize: 20}}>{weightUnit}</Text>
                            <IconSymbol size={20} name={"chevron.down"} color={'#fff'} />
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
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
    center: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingTop: 30,
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
})