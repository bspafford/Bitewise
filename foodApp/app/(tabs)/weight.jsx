import { IconSymbol } from "@/components/ui/IconSymbol";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMeals } from '../data/mealData';
import { useData } from '../data/userData';
import RippleButton from "../objects/rippleButton";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ZoomableChart() {
    const { userData, setUserData, getCurrWeight } = useData();
	const { getTodaysDate } = useMeals();

	
	const [scale, setScale] = useState(1);
	const scrollY = useRef(new Animated.Value(0)).current;
	const weightTop = scrollY.interpolate({
		inputRange: [0, 100],
		outputRange: [0, -100],
		extrapolateLeft: 'clamp',
    });
	
	// set weight screen
	const [settingWeight, setSettingWeight] = useState(false);
	const settingWeightAnim = useRef(new Animated.Value(0)).current;
	const settingWeightTop = settingWeightAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, screenHeight / 2 - 125],
	});
	const settingWeightButtonAnim = settingWeightAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [-200, 0],
	})
	const settingWeightButtonRot = settingWeightAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['-180deg', '0deg'],
	})

	function getDayBefore(dateString) {
		const dates = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));
		
		const index = dates.indexOf(dateString);
		
		if (index === -1) return null;
		if (index === dates.length - 1) return null;

		const prevDate = dates[index + 1];
		
		console.log("prev: ", date[prevData], prevDate);

		return data[prevDate];

	}

	function setWeight(cancel) {
		console.log(settingWeight);
		if (!settingWeight) {
			// screen isn't up yet
			setSettingWeight(true);
		} else if (cancel) {
			// set weight back and dont do anything
			setCurrWeight(Object.values(userData.weightList)[Object.keys(userData.weightList).length - 1]);
			setSettingWeight(false);
		} else {
			// set currWeight and add it to weight list
			console.log(getTodaysDate());
			setUserData(prev => ({
				...prev,
				weightList: {
					...prev.weightList,
					[getTodaysDate()]: currWeight,
				},
			}));
			setSettingWeight(false);
		}

	};

	useEffect(() => {
		if (settingWeight) {
			settingWeightAnim.setValue(0);
			Animated.timing(settingWeightAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false,
			}).start();
		} else {
			Animated.timing(settingWeightAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false,
			}).start();
		}
	}, [settingWeight]);

	const [currWeight, setCurrWeight] = useState(getCurrWeight()) // get last index in weightList
	
	function formatDate(date) {
		const newDate = new Date(`${date}T00:00:00`);
		const formatter = new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});

		const formatted = formatter.format(newDate);

		return formatted;
	}

	const pinchGesture = Gesture.Pinch()
		.onUpdate((e) => {
		//   // Clamp scale between 1 and 3
		//   let newScale = scale * e.scale;
		//   if (newScale < 1) newScale = 1;
		//   if (newScale > 3) newScale = 3;
			// const newScale = 2;
			// setScale(newScale);
			console.log("scale: ", e.scale);
			// setScale(2);
		})
		// .onEnd(() => {
		//   // Optionally snap scale or handle after pinch ends
		// });

	const baseWidth = screenWidth * 2; // base width for zoom level 1

	const data = {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
		datasets: [
		{
			data: [20, 45, 28, 80, 99, 43, 50, 60],
			strokeWidth: 2,
		},
		],
	};

	return (
		<View style={styles.container}>
			<Animated.View style={{position: 'absolute', zIndex: 100, width: '100%', height: '100%', backgroundColor: '#333', flexDirection: 'row', opacity: settingWeightAnim }}>
				<RippleButton style={{width: '50%'}} onPress={() => {setCurrWeight(Math.round((currWeight - .1) * 10) / 10)}} />
				<RippleButton style={{width: '50%'}} onPress={() => {setCurrWeight(Math.round((currWeight + .1) * 10) / 10)}} />
			</Animated.View>
			<Animated.View style={{zIndex: 100, top: settingWeightTop}} pointerEvents="none">
				<SafeAreaView pointerEvents="none">
					<View pointerEvents="none" style={{flexDirection: 'row', pointerEvents: 'none', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, paddingTop: 20}}>
						<Animated.View style={{opacity: settingWeightAnim}}>
							<IconSymbol size={36} name={'minus'} color={'#555'} />
						</Animated.View>
						<View style={styles.weightTextView}>
							<Text style={styles.weightText}>{currWeight} lbs</Text>
						</View>
						<Animated.View style={{opacity: settingWeightAnim}}>
							<IconSymbol size={36} name={'plus'} color={'#555'} />
						</Animated.View>
					</View>
				</SafeAreaView>
			</Animated.View>
			<ScrollView
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }]
				)}
			>
				<View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 30}}>
						<View style={styles.goalView}>
							<Text style={styles.goalViewText}>Start</Text>
							<View style={styles.goalWeightView}>
								<Text style={styles.goalWeightText}>{userData.startWeight} lbs</Text>
							</View>
						</View>
						<View style={styles.goalView}>
							<Text style={styles.goalViewText}>Goal</Text>
							<View style={styles.goalWeightView}>
								<Text style={styles.goalWeightText}>000 lbs</Text>
							</View>
						</View>
					</View>
					<View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10}}>
						<Text style={{color: 'white'}}>{userData.startWeight - currWeight > 0 ? `Lost so far: ${(userData.startWeight - currWeight).toFixed(1)}` : `Gained so far: ${(currWeight - userData.startWeight).toFixed(1)}`} lbs</Text>
						<Text style={{color: 'white'}}>Still to go: 00</Text>
					</View>
				<View style={{backgroundColor: 'black'}}>
					<GestureHandlerRootView>
						<GestureDetector gesture={pinchGesture}>
							<ScrollView horizontal>
							<LineChart
								data={data}
								width={baseWidth * scale} // zoom effect by scaling width
								height={220}
								chartConfig={{
								backgroundColor: "#1E2923",
								backgroundGradientFrom: "#08130D",
								backgroundGradientTo: "#1F4423",
								decimalPlaces: 0,
								color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
								labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
								style: {
									borderRadius: 16,
								},
								propsForDots: {
									r: "6",
									strokeWidth: "2",
									stroke: "#ffa726",
								},
								}}
								bezier
								style={{
								marginVertical: 8,
								borderRadius: 16,
								}}
							/>
							</ScrollView>
						</GestureDetector>
					</GestureHandlerRootView>
					<View style={styles.center}>
						{Object.entries(userData.weightList).reverse().map(([date, weight], index) => (
							<View key={date} style={{backgroundColor: '#333'}}>
								{index != 0 && <View style={styles.hr} />}
								<View style={styles.weightItem}>
									<Text style={styles.weightItemText}>{formatDate(date)}</Text>
									<View style={{flexDirection: 'row', gap: 10}}>
										<Text style={styles.weightItemText}>{weight}lbs</Text>
										<IconSymbol size={28} name={!getDayBefore(date) ? null : userData.weightList[date] > userData.weightList[getDayBefore(date)] ? 'chevron.up' : 'chevron.down'} color={"#fff"} />
									</View>
								</View>
							</View>
						))}
					</View>
				</View>
			</ScrollView>
				<Animated.View style={{position: 'absolute', zIndex: 100, bottom: 100, right: Animated.add(0, 25), transform: [{rotate: settingWeightButtonRot}]}}>
					<Pressable onPress={() => {setWeight(false)}} style={{backgroundColor: '#555', padding: 20, borderRadius: 100, borderWidth: 2, borderColor: 'white', shadowColor: 'black', shadowOffset: {width: -4, height: 4}, shadowOpacity: .5, shadowRadius: 8,}}>
						{/* <IconSymbol size={28} name={'plus'} color={'white'}/> */}
						<IconSymbol size={28} name={settingWeight ? 'checkmark' : 'plus'} color={'white'}/>
					</Pressable>
				</Animated.View>
				<Animated.View style={{position: 'absolute', zIndex: 100, bottom: 100, left: Animated.add(settingWeightButtonAnim, 25)}}>
					<Pressable onPress={() => {setWeight(true)}} style={{backgroundColor: '#555', padding: 20, borderRadius: 100, borderWidth: 2, borderColor: 'white', shadowColor: 'black', shadowOffset: {width: -4, height: 4}, shadowOpacity: .5, shadowRadius: 8,}}>
						<IconSymbol size={28} name={'multiply'} color={'white'} />
					</Pressable>
				</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#333',
	},
	hr: {
		borderBottomColor: '#555',
		borderBottomWidth: 1,
		marginHorizontal: 10,
	},
	center: {
		alignItems: 'center',
	},
	weightButton: {
		backgroundColor: '#555',
		borderRadius: 100,
		padding: 10,
		borderColor: 'white',
		borderWidth: 2,
	},
	weightTextView: {
		marginHorizontal: 30,
		paddingVertical: 10,
		backgroundColor: '#555',
		flex: 1,
		alignItems: 'center',
		borderColor: 'white',
		borderWidth: 2,
		borderRadius: 5,
	},
	weightText: {
		color: 'white',
		fontSize: 30,
		fontWeight: 'bold',
	},
	weightItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '90%',
		backgroundColor: '#333',
		padding: 10,
	},
	weightItemText: {
		color: 'white',
		fontSize: 20,
	},
	goalView: {
		justifyContent: 'center',
		alignItems: 'center',
		gap: 2,
	},
	goalViewText: {
		color: 'white',
		fontSize: 15,
	},
	goalWeightView: {
		backgroundColor: '#555',
		borderRadius: 5,
	},
	goalWeightText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
		paddingVertical: 5,
		paddingHorizontal: 10,
	}
});
