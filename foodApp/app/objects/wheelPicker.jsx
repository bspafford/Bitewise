import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
	Animated,
	StyleSheet,
	Text,
	View,
} from 'react-native';

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

export default function AnimatedWheelPicker({selected, setSelected, list}) {
	const flatListRef = useRef(null);
	//const [lastIndex, setLastIndex] = useState(0);
	let lastIndex = 0;
	
	const maxIndex = list.length - 1;
	const maxScroll = maxIndex * ITEM_HEIGHT;
	
	const scrollY = useRef(new Animated.Value(0)).current;
	
	function setScroll() {
		const itemIndex = Math.max(list.findIndex(item => item === selected), 0);
		const clampedIndex = Math.max(0, Math.min(itemIndex, maxIndex));
		const offset = clampedIndex * ITEM_HEIGHT;
		flatListRef.current?.scrollToOffset({ offset, animated: false});
	}

	useEffect(() => {
		const listener = scrollY.addListener(({ value }) => {
			// Prevent haptics if scrollY is outside bounds
			if (value < 0 || value > maxScroll) return;

			const currentIndex = Math.round(value / ITEM_HEIGHT);

			// Only vibrate and update selected index if index changed and is valid
			if (
				currentIndex !== lastIndex &&
				currentIndex >= 0 &&
				currentIndex <= maxIndex
			) {
				//setLastIndex(currentIndex);
				lastIndex = currentIndex;
				setSelected(list[currentIndex]);

				Haptics.selectionAsync();
			}
		});
		return () => scrollY.removeListener(listener);
	}, [lastIndex]);

	return (
		<View style={styles.container}>
		{/* <Text style={styles.title}>Selected: {months[lastIndex]}</Text> */}

		<Animated.FlatList
			ref={flatListRef}
			onLayout={setScroll}
			data={list}
			style={{width: '100%'}}
			keyExtractor={(item) => item}
			showsVerticalScrollIndicator={false}
			bounces={true}
			decelerationRate="fast"
			snapToInterval={ITEM_HEIGHT}
			onScroll={Animated.event(
				[{ nativeEvent: { contentOffset: { y: scrollY } } }],
				{ useNativeDriver: true }
			)}
			contentContainerStyle={{
				paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
			}}
			getItemLayout={(_, index) => ({
				length: ITEM_HEIGHT,
				offset: ITEM_HEIGHT * index,
				index,
			})}
			renderItem={({ item, index }) => {
				const inputRange = [
					(index - 2) * ITEM_HEIGHT,
					index * ITEM_HEIGHT,
					(index + 2) * ITEM_HEIGHT,
				];

				const scale = scrollY.interpolate({
					inputRange,
					outputRange: [0.7, 1, 0.7],
					extrapolate: 'clamp',
				});

				const opacity = scrollY.interpolate({
					inputRange,
					outputRange: [0.3, 1, 0.3],
					extrapolate: 'clamp',
				});

				return (
					<Animated.View
					style={[styles.item, { transform: [{ scale }], opacity }]}
					>
					<Text style={styles.text}>{item}</Text>
					</Animated.View>
				);
			}}
		/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: ITEM_HEIGHT * VISIBLE_ITEMS,
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	title: {
		marginBottom: 10,
		fontSize: 18,
		fontWeight: '500',
		color: 'white',
	},
	item: {
		height: ITEM_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 20,
		color: '#ccc',
	},
});
