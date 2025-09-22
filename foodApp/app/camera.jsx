import { IconSymbol } from '@/components/ui/IconSymbol';
import { useNavigation } from '@react-navigation/native';
import { Camera, CameraView } from "expo-camera";
import { router, Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useMeals } from './data/mealData';

function CustomHeader() {		
	const navigation = useNavigation();
	return (
		<View style={{ backgroundColor: '#334', paddingTop: 0, paddingBottom: 10 }}>
			<Pressable onPress={() => {}} style={{ position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingLeft: 10 }}>
				{/* navigation.goBack() */}
				<IconSymbol size={28} name={"chevron.left"} color={'#007AFF'} />
				<Text style={styles.headerButton}>Back</Text>
			</Pressable>
		</View>
	);
}

export default function App() {
	const { getTodaysDate } = useMeals();

	const [hasPermission, setHasPermission] = useState(null);
  	const [scanned, setScanned] = useState(false);
	const scanLock = useRef(false);
	const animation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
		Animated.sequence([
			Animated.timing(animation, {
			toValue: 1,
			duration: 333,
			useNativeDriver: false,
			}),
			Animated.timing(animation, {
			toValue: 0,
			duration: 333,
			useNativeDriver: false,
			}),
		])
		).start();
	}, [animation]);

	const lineColor = animation.interpolate({
		inputRange: [0, 1],
		outputRange: ['white', 'red'],
	});

	useEffect(() => {
		const getCameraPermissions = async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		};

		getCameraPermissions();
	}, []);

	const handleBarcodeScanned = ({ type, data }) => {
		print("it worked!")
		if (scanLock.current)
			return;

		scanLock.current = true;

		console.log("scanned:", scanned);
		if (scanned)
			return;

		setScanned(true);
		//alert(`Bar code with type ${type} and data ${data} has been scanned!`);
		
		fetch('http://10.0.0.184/foodDataAPI/searchBarcode.php', {
     		method: 'POST',
      		headers: {
        		'Content-Type': 'application/json', //'application/x-www-form-urlencoded',
      		},
      		body: JSON.stringify({ barcode: data }), //  new URLSearchParams({ foodName: searchText })
    	})
		.then((res) => res.json())
		.then((json) => {
			console.log("json:", json);
			// return;
			// converts nutrition to json
			const parsed = json.map(item => ({
				... item,
				foodnutrient: JSON.parse(item.foodnutrient),
				labelnutrients: JSON.parse(item.labelnutrients),
			}));

			console.log("parsed:", parsed[0]);

			const href = {
				pathname: "foodNutritionPage",
				params: {
					food: JSON.stringify(parsed[0]),
					date: getTodaysDate(),
				},
			};
			router.replace(href);
      	})
      	.catch((error) => {
        	console.error('Error:', error);
      	})
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ 
				headerBackTitle: 'Home', 
				header: () => <CustomHeader></CustomHeader>
				}}></Stack.Screen>
			<CameraView
				onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
				barcodeScannerSettings={{
				barcodeTypes: ["qr", "pdf417", "UPC", "EAN-13"],
				}}
				style={styles.camera}
			/>
			<View style={styles.center}>
				<Animated.View style={[styles.hr, {borderBottomColor: lineColor}]}></Animated.View>
			</View>
		{/* {scanned && (
			<Button title={"Tap to Scan Again"} onPress={() => {setScanned(false); scanLock.current = false}} />
		)} */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		backgroundColor: '#334',
	},
	center: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		width: '100%',
	},
	hr: {
		borderBottomWidth: 2.5,
		width: '60%',
	},
	camera: {
		height: '40%',
	},
	headerButton: {
        color: '#007AFF', 
        fontSize: 16,
    },
});