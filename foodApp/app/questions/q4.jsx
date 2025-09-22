import { IconSymbol } from '@/components/ui/IconSymbol';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Q4({selectedGoal, setSelectedGoals}) {
    const goals = ["Lose Weight", "Maintain Weight", "Gain Weight"];

    return (
        <View>
            <View>
                <Text style={[styles.question]}>How active are you?</Text>
            </View>
            <View style={[styles.center, {flexDirection: 'column', gap: 10}]}>
                {goals.map((title, index) => (
                    <Animated.View key={index} style={[styles.multipleChoiceBox, {borderWidth: 3, borderColor: selectedGoal == index ? '#fff' : '#00000000'}]}>
                        <Pressable onPress={() => {setSelectedGoals(index)}}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15}}>
                                <View>
                                    <Text style={styles.multipleChoiceTitle}>{title}</Text>
                                    <Text style={styles.multipleChoiceDescription}>this is the description of the choice</Text>
                                </View>
                                <IconSymbol size={28} name={selectedGoal == index ? "checkmark.circle.fill" : "circle"} color={'#fff'} />
                            </View>
                        </Pressable>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    },
    multipleChoiceBox: {
        backgroundColor: '#222',
        padding: 15,
        borderRadius: 10,
        width: '100%',
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