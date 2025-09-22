import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

export default function OptionsSelector({showOptions, setShowOptions}) {
    const [selected, setSelected] = useState('Select Meal');
    const options = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const optionsAnim = useRef(new Animated.Value(0)).current;

    const optionsScale = optionsAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [.75, 1],
    })

    useEffect(() => {
        if (showOptions) {
            optionsAnim.setValue(0);
            Animated.timing(optionsAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [showOptions])

    return (
    <View style={styles.container}>
        {showOptions && <Animated.View style={[styles.dropdown, { transform: [{translateX: '-50%'}, {scale: optionsScale}], opacity: optionsAnim}]}>
            {options.map((option, index) => (
                <Pressable
                key={option}
                onPress={() => {
                    setSelected(option);
                    setShowOptions(false);
                }}
                style={styles.option}
                >
                {index != 0 && <View style={[styles.hr, { width: '100%', borderBottomColor: '#555' }]}></View>}
                <Text style={styles.optionsText}>{option}</Text>
                </Pressable>
            ))}
        </Animated.View>}
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '100%',
        left: '50%',
    },
    dropdown: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue', // #222
        width: 200,
        borderRadius: 10,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // For Android compatibility with older versions

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
})