import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

export default function SelectedMealButton({selected, setSelected, showOptions, setShowOptions, hasPressedSave, setHasPressedSave}) {
    const options = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const optionsAnim = useRef(new Animated.Value(0)).current;
    const optionsScale = optionsAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [.75, 1],
    })

    useEffect(() => {
        showMealMenu();
    }, [showOptions])

    function showMealMenu() {
        console.log("pressing");
        // setShowOptions(prev => !prev)
        optionsAnim.setValue(0);
        Animated.timing(optionsAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }

    return (
        <View style={{left: '50%', transform: [{translateX: '-50%'}]}}>
            <Pressable
                onPress={() => setShowOptions(!showOptions)}
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
                        // if (hasPressedSave)
                            // returnHome(option);
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
    )
}

const styles = StyleSheet.create({
    container: {
        
    },
    hr: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 5,
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
})