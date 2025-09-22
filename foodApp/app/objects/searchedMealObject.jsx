import { IconSymbol } from '@/components/ui/IconSymbol';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatName } from '../data/formatter';
import { useMeals } from '../data/mealData';

export default function SearchedMealObject({ item, isSelected, onSelect, date }) {
    const { parseHouseholdServingFullText } = useMeals();

    const foodItem = item.item || item;

    return (
        <Link
            href={{ pathname: "../foodNutritionPage", params: { food: JSON.stringify(foodItem), date: date } }}
            asChild
        >
        <Pressable>
            <View style={styles.foodBox}>
            <View style={styles.infoView}>
                <Text style={styles.foodName}>{formatName(foodItem.description ?? "") ?? ""}</Text>
                <View>
                <Text style={styles.foodInfoText}>
                    {parseHouseholdServingFullText(foodItem.householdServingFullText)[0] ?? 0}{" "}
                    {parseHouseholdServingFullText(foodItem.householdServingFullText)[1] ?? ""},{" "}
                    {foodItem.labelnutrients[0].calories} cal,{" "}
                    {formatName(foodItem.brandOwner ?? "") ?? ""}
                </Text>
                </View>
            </View>
            <Pressable style={styles.addButton} onPress={() => onSelect(foodItem)}>
                <IconSymbol
                size={28}
                name={isSelected ? "checkmark.circle.fill" : "circle"}
                color="#ffffff"
                />
            </Pressable>
            </View>
        </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    foodBox: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: '#444455',
		marginBottom: 10,
		borderRadius: '5%',
		padding: 10,
	},
    infoView: {
		flex: 1,
	},
    foodName: {
		color: 'white',
		fontSize: 26,
	},
    foodInfoText: {
		color: 'white',
		fontSize: 15,
	},
    addButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		borderRadius: '100%',
	},
})