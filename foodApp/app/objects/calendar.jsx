// CalendarScreen.jsx
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { useMeals } from '../data/mealData';

export default function CalendarScreen({visible, setVisible, date, setDate}) {
    const screenHeight = Dimensions.get('window').height;
    const { getTodaysDate } = useMeals();
    const calendarRef = useRef();
    const calendarOpacity = useRef(new Animated.Value(0)).current;
    const calendarTranslateY = useRef(new Animated.Value(-screenHeight * 0.2)).current;
    const AnimatedCalendar = Animated.createAnimatedComponent(CalendarList);

    // show calendar
    useEffect(() => {
        Animated.parallel([
            Animated.timing(calendarOpacity, {
                toValue: 1,
                duration: 650,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(calendarTranslateY, {
                toValue: 0,
                duration: 650,
                easing: Easing.out(Easing.exp),
                useNativeDriver: false,
            }),
        ]).start();
    }, [visible]);

    // hide calendar
    function hideCalendar() {
        Animated.parallel([
            Animated.timing(calendarOpacity, {
                toValue: 0,
                duration: 450,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(calendarTranslateY, {
                toValue: -screenHeight * 0.2,
                duration: 750,
                easing: Easing.out(Easing.exp),
                useNativeDriver: false,
            }),
        ]).start(() => {setVisible(false)});
    }

    const jumpToToday = () => {
        const dateString = getTodaysDate();
        setDate(dateString);

        if (calendarRef.current) {
            const today = new Date(dateString);
            const midMonth = new Date(today.getFullYear(), today.getMonth()+1, 15);
            calendarRef.current.scrollToMonth(midMonth);
        }
    };

    function selectDate(date) {
        setDate(date.dateString);
        hideCalendar();
    }

	return (
		<Animated.View style={[styles.container, {opacity: calendarOpacity, transform: [{translateY: calendarTranslateY}]}]}>
            <View>
                <AnimatedCalendar
                    ref={calendarRef}
                    style={styles.calendar}
                    horizontal={true}
                    pagingEnabled={true}
                    current={date}
                    onDayPress={selectDate}
                    markingType={'custom'}
                    markedDates={{
                        [date]: {
                            customStyles: {
                                container: {
                                borderWidth: 2,
                                borderColor: '#007AFF',
                                borderRadius: 20, // Circle
                                },
                                text: {
                                color: '#007AFF',
                                fontWeight: 'bold',
                                },
                            },
                        },
                        [getTodaysDate()]: { selected: true, selectedColor: '#2196F3', fontWeight: 'bold' },
                    }}
                    theme={{
                        calendarBackground: '#334',

                        // Month & year
                        textMonthFontSize: 22,
                        textMonthFontWeight: 'bold',
                        monthTextColor: 'white',

                        // Day of week labels (Mon, Tue, etc.)
                        textSectionTitleColor: '#888',
                        textSectionTitleDisabledColor: '#ccc',

                        // Day numbers (1, 2, 3...)
                        dayTextColor: 'white',
                        textDayFontSize: 16,
                        textDayFontWeight: '500',

                        // Selected date
                        selectedDayBackgroundColor: '#2196F3',
                        selectedDayTextColor: '#fff',

                        // Disabled dates
                        textDisabledColor: '#d9e1e8',

                        // Arrow colors
                        arrowColor: '#2196F3',
                    }}
                />
                <Pressable onPress={jumpToToday}><Text style={{fontSize: 20, paddingHorizontal: 30, paddingBottom: 10, color: '#2196F3' }}>Today</Text></Pressable>
                <Animated.View>
                <Pressable onPress={() => {hideCalendar()}} style={{width: '100%', height: '100%', backgroundColor: '#00000080'}}>
                </Pressable>
                </Animated.View>
            </View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
        position: 'absolute',
        width: '100%',
		backgroundColor: '#334',
		paddingTop: 50,
	},
	infoBox: {
		marginTop: 20,
		alignItems: 'center',
	},
	dateText: {
		fontSize: 18,
		color: '#444',
	},
	selectedDate: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#2196F3',
		marginTop: 4,
	},
    calendar: {
        backgroundColor: '#334',
    }
});
