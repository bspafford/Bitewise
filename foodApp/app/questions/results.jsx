import { StyleSheet, Text, View } from 'react-native';

export default function Results({dailyCalories}) {
    return (
        <View>
            <View>
                <Text style={[styles.resultText]}>Results:</Text>
                <Text style={[styles.resultText]}>{dailyCalories}</Text>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    resultText: {
        color: 'white',
        fontSize: 35,
        fontWeight: 'bold',
    },
})