import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function nutrientBlock({ name, amount, percent, fontWeight = 800 }) {
    return (
        <View>
            <View style={styles.hr}></View>
            <View style={styles.nutrientView}>
                <View style={styles.nutrientText}>
                    <Text style={[styles.text, {fontWeight: fontWeight}]}>{name}</Text>
                    <Text style={styles.text}>{amount}</Text>
                </View>
                <Text style={[styles.text, { fontWeight: 800 }]}>{percent}%</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    hr: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 5,
    },
    text: {
        color: 'white',
        fontSize: 18,
    },
    nutrientView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nutrientText: {
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
    }
});