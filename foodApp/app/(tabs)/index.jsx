import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, FlatList, Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { formatName } from '../data/formatter';
import { useMeals } from '../data/mealData';
import { useData } from '../data/userData';
import Calendar from '../objects/calendar';
import MealObject from '../objects/mealObject';
import NutrientProgress from '../objects/nutrientProgress';
import SelectedMealButton from '../objects/selectedMealButton';
import FoodPage from '../searchPages/foodPage';
import RecentlyEaten from '../searchPages/recentlyEaten';

const HomeScreen = () => {
	const { meals, mealNames, getTodaysDate, getNutrientFromCode, addMultipleFoodItems } = useMeals();
	const { searchHistory, setSearchHistory } = useData();

    const [selected, setSelected] = useState('Select Meal');
	const [showOptions, setShowOptions] = useState(false);
    const [hasPressedSave, setHasPressedSave] = useState(false);

	const [searchText, setSearchText] = useState('');
  	const position = useRef(new Animated.Value(0)).current;
  	const screenHeight = Dimensions.get('window').height;
  	const screenWidth = Dimensions.get('window').width;
  	const [showThrobber, setShowThrobber] = useState(false);
  	const [noResults, setNoResults] = useState(false);
	const [date, setDate] = useState(getTodaysDate());
	
	const AniamtedFlatList = Animated.createAnimatedComponent(FlatList);
	const searchOptions = ["Cook Book", "Recipes", "Food", "Recently Eaten", "Most Eaten", "Saved Meals"];
	const searchOptionSize = 130;
	const searchOptionsScrollX = useRef(new Animated.Value(screenWidth * 2)).current;
	const [selectedFoodItems, setSelectedFoodItems] = useState(new Set([]));
	function selectedFoodItem(foodItem) {
		// console.log("foodItem: ", foodItem);
		console.log("asdf: ", selectedFoodItems);
		// if (selectedFoodItems[foodItem.gtinUpc]) { // already selected
		// 	setSelectedFoodItems(prev => {
		// 		const newItems = { ...prev };
		// 		delete newItems[foodItem.gtinUpc];
		// 		return newItems;
		// 	});
		// } else {
		// 	setSelectedFoodItems(prev => ({ // selected item
		// 		...prev,
		// 		[foodItem.gtinUpc]: foodItem
		// 	}));
		// }

		if (selectedFoodItems.has(foodItem.gtinUpc)) { // already selected
			// remove from selectedFoodItems	
			setSelectedFoodItems(prev => {
				const newSet = new Set(prev);
				newSet.delete(foodItem.gtinUpc);
				return newSet;
			});
		} else {
			// add to selectedFoodItems
			setSelectedFoodItems(prev => new Set(prev).add(foodItem.gtinUpc));
		}
	}

	// progress bar animation stuff
	const scrollY = useRef(new Animated.Value(0)).current;
	const [hasVibrated, setHasVibrated] = useState(false);
	const threshold = 80;
	const scrollRef = useRef(null);
	const [isExpanded, setIsExpanded] = useState(false);
	const progressBarTopExpanded = useRef(new Animated.Value(0)).current;
	const scrollViewTranslate = useRef(new Animated.Value(0)).current;
	const [canScroll, setCanScroll] = useState(true);
	const canCollapse = useRef(false);
	const collapsing = useRef(false);

	const [showCalendar, setShowCalendar] = useState(false);

	const progressBarTop = scrollY.interpolate({
		inputRange: [0, 100],
      	outputRange: [0, -100],
    });

	const headerTop = scrollY.interpolate({
		inputRange: [0, 100],
		outputRange: [0, -100],
		extrapolateLeft: 'clamp',
	})

	const mealListTranslateY = scrollY.interpolate({
		inputRange: [-60, 0],
		outputRange: [75, 0],
		extrapolateRight: 'clamp',
	});

	const handleScroll = ({nativeEvent}) => {
		const y = nativeEvent.contentOffset.y;
		if (y < -threshold && !hasVibrated) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // quick vibrate
			setHasVibrated(true);
		} else if (y >= -threshold && hasVibrated) {
			setHasVibrated(false);
		}

		if (isExpanded && canCollapse.current)
			collapseFullScreen();

		if (collapsing.current)
			scrollRef.current.scrollTo({ y: 0, animated: false });
	};

	const collapseFullScreen = () => {
		if (collapsing.current)
			return;

		collapsing.current = true;
		scrollRef.current.scrollTo({ y: 0, animated: false });

		Animated.timing(progressBarTopExpanded, {
			toValue: 0,
			duration: 400,
			useNativeDriver: false,
		}).start();

		Animated.timing(scrollViewTranslate, {
			toValue: 0,
			duration: 400,
			useNativeDriver: false,
		}).start(() => {
			setCanScroll(true);
			setIsExpanded(false);
			scrollRef.current.scrollTo({ y: 0, animated: false });
			collapsing.current = false;
		});
	}

	const handleRelease = ({nativeEvent}) => {
		// set padding of top to like 100 or sum using ref?
		const y = nativeEvent.contentOffset.y * -1;
		if (y <= threshold || isExpanded)
			return;
		
		canCollapse.current = false;
		setIsExpanded(true);

		progressBarTopExpanded.setValue(y);
		Animated.timing(progressBarTopExpanded, {
			toValue: screenHeight / 4,
			duration: 400,
			easing: Easing.bezier(0.42, 0, 0.58, 1),
			useNativeDriver: false,
		}).start();
		
		Animated.timing(scrollViewTranslate, {
			toValue: screenHeight,
			duration: 400,
			easing: Easing.bezier(0.42, 0, 0.58, 1),
			useNativeDriver: false,
		}).start(() => {
			canCollapse.current = true; // on anim finish
		});
	};

  	// temp
  	const [foodItems, setFoodItems] = useState([]);

  	const animateToTop = () => {
    	// clears food items list if search bar at bottom (not in food search view)
    	if (position.__getValue() === 0) {
			setFoodItems([]);
			setNoResults(false);
		}

    	Animated.timing(position, {
			toValue: 1,
			duration: 300,
			useNativeDriver: false,
		}).start();
  	};

  	const animateToBottom = () => {
    	setSearchText('');
		setNoResults(false);
    	Keyboard.dismiss();
    	Animated.timing(position, {
      		toValue: 0,
      		duration: 300,
      		useNativeDriver: false,
    	}).start();
  	};

  	const searchQuery = (searchValue = '') => {
		  
		  let search = searchText.trim();
		  if (searchValue != '')
			search = searchValue
		
    	if (search.trim() === '') return; // returns empty input
    
    	setShowThrobber(true);
    	setSearchText('');
		setNoResults(false);

    	fetch('http://10.0.0.184/foodDataAPI/', {
     		method: 'POST',
      		headers: {
        		'Content-Type': 'application/json', //'application/x-www-form-urlencoded',
      		},
      		body: JSON.stringify({ foodName: search }), //  new URLSearchParams({ foodName: searchText })
    	})
		.then((res) => res.json())
		.then((json) => {
			setShowThrobber(false);
			if (json.length == 0)
				setNoResults(true);
			
			// converts nutrition to json
			const parsed = json.map(item => ({
				... item,
				foodnutrient: JSON.parse(item.foodnutrient),
				labelnutrients: JSON.parse(item.labelnutrients),
			}));
			setFoodItems(parsed);

			setSearchHistory(prev => {
				const newSet = new Set(prev);
				newSet.delete(search); // remove if in set, to bring to end
				newSet.add(search);
				return newSet;
			});
      	})
      	.catch((error) => {
        	console.error('Error:', error);
      	})
  	}

  	const translateMenuView = position.interpolate({
    	inputRange: [0, 1],
    	outputRange: [screenHeight * 0.775, screenHeight * 0.075],
  	});

  	const translateSearchBar = position.interpolate({
    	inputRange: [0, 1],
    	outputRange: [screenHeight * 0.84, screenHeight * 0.135],
  	});

  	const translateEllipse = position.interpolate({
    	inputRange: [0, 1],
    	outputRange: [20, -screenHeight * 0.2],
  	});

  	const translateSearchView = position.interpolate({
    	inputRange: [0, 1],
    	outputRange: [screenHeight * 0.775, screenHeight * 0],
  	});

  	const rotateRemoveSearchText = position.interpolate({
    	inputRange: [0, 1],
    	outputRange: ['45deg', '0deg'],
  	});

  	const reversePosition = position.interpolate({
    	inputRange: [0, 1],
    	outputRange: [1, 0],
  	});

  	const searchColor = position.interpolate({
    	inputRange: [0, 1],
    	outputRange: ['#008cff', '#222'],
  	});

	function addSelectedFoodItems() {
		// convert gtinUpc to json
		const jsonArray = foodItems.filter(item => selectedFoodItems.has(item.gtinUpc));
		addMultipleFoodItems(date, selected, jsonArray);
		setSelectedFoodItems(new Set());
		animateToBottom();
	}

	useEffect(() => {
		if (selected != "Select Meal" && hasPressedSave) {
			addSelectedFoodItems();
			setHasPressedSave(false);
		}
	}, [selected]);

	function addFoodForMeal(mealName) {
		setSelected(formatName(mealName));
		animateToTop();
	}

  	return (
    	<SafeAreaView style={styles.container}>
      		<Animated.ScrollView style={[{position: 'absolute', width: '100%', height: '95%', paddingTop: Animated.add(scrollViewTranslate, 350), }]}
				ref={scrollRef}
				scrollEnabled={canScroll}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false,
						listener: handleScroll,
					}
				)}
				showsVerticalScrollIndicator={false}
				onScrollEndDrag={handleRelease}
				scrollEventThrottle={16}
				bounces={!isExpanded}
			>
				<Animated.View style={[{ transform: [{ translateY: mealListTranslateY }] }]}>
					{mealNames.map(mealName => (
						<MealObject key={mealName} date={date} mealName={mealName} foodItems={meals[date]?.[mealName] ?? []} addFoodForMeal={addFoodForMeal}></MealObject>
					))}
				</Animated.View>
				{/* <Link href="test" style={[{ padding: 50 }]} asChild><Pressable><Text style={[{ color: 'white', fontSize: 30 }]}>test</Text></Pressable></Link> */}
			</Animated.ScrollView>
			<SafeAreaView style={{ width: '100%' }}>
				{/*transform: [{translateY: isExpanded ? progressBarTopExpanded : progressBarTop, }] */}
				<Animated.View style={[{ position: 'absolute', width: '100%', display: 'flex', top: Animated.add(isExpanded ? progressBarTopExpanded : progressBarTop, 0) }]}>
					<NutrientProgress date={date}></NutrientProgress>
				</Animated.View>
				<Animated.View style={[styles.header, { top: headerTop }]}>
					<Pressable onPress={() => {setShowCalendar(true)}}>
						<IconSymbol size={32} name={"calendar"} color={'#ffffff'} />
					</Pressable>
				</Animated.View>
			</SafeAreaView>

			{showCalendar && <Calendar visible={showCalendar} setVisible={setShowCalendar} date={date} setDate={setDate}></Calendar>}

			<Animated.View style={[styles.menuDiv, { top: translateMenuView }]}>
				<Animated.View style={[styles.ellipse, { backgroundColor: searchColor, top: translateEllipse }]}></Animated.View>
				<Animated.View style={[styles.searchBoxOverlay, { height: screenHeight, backgroundColor: searchColor }]}></Animated.View>
			</Animated.View>
      
			<Animated.View style={[styles.selectMealView, {zIndex: 100, opacity: position, top: Animated.add(translateSearchView, 65)}]}>
				<SelectedMealButton selected={selected} setSelected={setSelected} showOptions={showOptions} setShowOptions={setShowOptions} hasPressedSave={hasPressedSave} setHasPressedSave={setHasPressedSave} />
			</Animated.View>
			<Animated.View style={[styles.searchView, { opacity: position, top: translateSearchView }]}>
				<Pressable onPress={animateToBottom} style={styles.closeButton}><IconSymbol size={28} name={"multiply"} color={'#ffffff'} /></Pressable>
				{ selectedFoodItems.size != 0 && <Pressable onPress={() => {
					if (selected != "Select Meal") {
						// add multiple foods, then clear selected foods and search menu
						addSelectedFoodItems();
					} else {
						// show select meal menu
						setHasPressedSave(true);
						setShowOptions(true);
					}
				}}><Text style={styles.saveSelectedButton}>Save ({selectedFoodItems.size})</Text></Pressable>}
				<View style={styles.cantFindFoodView}>
				<Text style={styles.cantFindFoodText}>Couldn't Find a Food</Text>
				</View>
				<View style={styles.foodItemHolder}>
					<View style={{ width: '100%', justifyContent: 'center' }}>
						<Animated.View style={{ flexDirection: 'row', transform: [{translateX: Animated.add(Animated.multiply(Animated.divide(searchOptionsScrollX, -(screenWidth * (searchOptions.length - 1))), searchOptionSize * 10 / 2), screenWidth / 2 - searchOptionSize / 2)}] }}>
							{searchOptions.map((item, index) => {
								return (
									<View key={index} style={{width: searchOptionSize, alignItems: 'center' }}>
										<Text style={{color: 'white', fontSize: 12, fontWeight: 'bold' }}>{item}</Text>
									</View>
								)
							})}
							
						</Animated.View>
						<View style={{ position: 'absolute', width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
							<View style={{flexDirection: 'row'}}>
								<View style={{ backgroundColor: '#222', paddingLeft: 20}}>
									<IconSymbol size={20} name={"chevron.left"} color={'#fff'} />
								</View>
								<LinearGradient
									colors={['#222', '#22222200']}
									style={{ width: 100, height: '100%' }}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
								>
								</LinearGradient>
							</View>
							<View style={{flexDirection: 'row'}}>
								<LinearGradient
									colors={['#22222200', '#222']}
									style={{ width: 100, height: '100%' }}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
								>
								</LinearGradient>
								<View style={{ backgroundColor: '#222', paddingRight: 20}}>
									<IconSymbol size={20} name={"chevron.right"} color={'#fff'} />
								</View>
							</View>
						</View>
					</View>
					<AniamtedFlatList keyboardShouldPersistTaps="handled" style={{ height: '100%' }} data={searchOptions} keyExtractor={(item, index) => index.toString()}
						horizontal
						showsHorizontalScrollIndicator={false}
						snapToInterval={screenWidth}
						decelerationRate="fast"
						initialScrollIndex={2}
						getItemLayout={(data, index) => ({
							length: screenWidth,
							offset: screenWidth * index,
							index,
						})}
						scrollEventThrottle={16}
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { x: searchOptionsScrollX } } }],
							{ useNativeDriver: true }
						)}
						renderItem={({ item }) => {
							switch(item) {
								case 'Food':
									return <FoodPage showThrobber={showThrobber} foodItems={foodItems} searchHistory={searchHistory} searchQuery={searchQuery} searchText={searchText} selectedFoodItems={selectedFoodItems} selectedFoodItem={selectedFoodItem} date={date}  />;
								case 'Recently Eaten':
									return <RecentlyEaten selectedMeal={selected} selectedFoodItems={selectedFoodItems} selectedFoodItem={selectedFoodItem} date={date} />
								default:
									return <View style={{width: screenWidth, height: '100%'}} />;
							}
						}}
					/>
				</View>
				{selectedFoodItems.size > 0 && <View style={{position: 'absolute', bottom: 10, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
					<Pressable style={{width: '65%'}} onPress={() => {setSelectedFoodItems(new Set())}}>
						<View style={{width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333', borderWidth: 2, borderColor: '#444', borderRadius: 100, gap: 3, paddingVertical: 16}}>
							<Text style={{color: 'white'}}>{selectedFoodItems.size} {selectedFoodItems.size == 1 ? "item selected" : "items selected"}</Text>
							<Text style={{color: '#008cffff'}}>Unselect All</Text>
						</View>
					</Pressable>
				</View>}
			</Animated.View>
			<Animated.View style={[styles.searchBar, { top: translateSearchBar }]}>
				<TextInput
					style={styles.searchInput}
					placeholder="Search..."
					placeholderTextColor="gray"
					value={searchText}
					onChangeText={setSearchText}
					onFocus={animateToTop}
					onSubmitEditing={() => {searchQuery()}}
				/>
				{noResults && <Text style={{position: 'absolute', color: 'white', fontSize: 14, marginTop: 150}}>Couldn't Find Anything Thing...</Text>}
				<Animated.View style={[styles.barcodeButton, {opacity: reversePosition}]}>
					<Link href="camera" style={{marginHorizontal: 'auto'}} asChild>
						<Pressable>
							<IconSymbol size={28} name={"barcode.viewfinder"} color={'gray'} />
						</Pressable>
					</Link>
				</Animated.View>
				<Animated.View style={[styles.removeSearchText, {opacity: position, transform: [{ rotate: rotateRemoveSearchText }]}]}>
					<Pressable onPress={() => {
						setSearchText('');
					}}>
						<IconSymbol size={20} name={"multiply"} color={'#000'} />
					</Pressable>
				</Animated.View>
				<Animated.View style={ styles.magnifyingGlass }>
					<Pressable onPress={() => {
						setSearchText('');
					}}>
						<IconSymbol size={24} name={"magnifyingglass"} color={'gray'} />
					</Pressable>
				</Animated.View>
			</Animated.View>
		</SafeAreaView>
  	)
}

export default HomeScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		backgroundColor: '#111'
	},
	header: {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	image: {
		width: '100%',
		height: '100%',
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
	},
	title: {
		color: 'white',
		fontSize: 42,
		fontWeight: 'bold',
		textAlign: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
		marginBottom: 120,
	},
	link: {
		color: 'white',
		fontSize: 42,
		fontWeight: 'bold',
		textAlign: 'center',
		textDecorationLine: 'underline',
		backgroundColor: 'rgba(0,0,0,0.5)',
		padding: 4,
	},
	button: {
		height: 60,
		borderRadius: 20,
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
		padding: 6,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		padding: 4,
	},
	menuDiv: {
		position: 'absolute',
		width: '100%',
		height: '15%',
		bottom: 0,
	},
	searchBar: {
		position: "absolute",
		width: '100%',
		top: '39%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	barcodeButton: {
		position: "absolute",
		left: '82%',
	},
	removeSearchText: {
		position: "absolute",
		left: '83%',
	},
	magnifyingGlass: {
		position: 'absolute',
		left: '11%',
	},
	searchInput: {
		backgroundColor: 'rgba(255, 255, 255, 1)',
		color: 'black',
		fontSize: 24,
		borderRadius: 100,
		width: '85%',
		paddingVertical: 12,
		paddingRight: 20,
		paddingLeft: 45,
	},
	ellipse: {
		position: "absolute",
		backgroundColor: '#008cffff',
		width: "100%",
		aspectRatio: 1,
		borderRadius: "100%",
		transform: [{ scaleX: 2 }],
	},
	searchBoxOverlay: {
		position: "absolute",
		backgroundColor: '#008cffff',
		width: '100%',
		top: '100%',
	},
	closeButton: {
		position: 'absolute',
		top: 70,
		left: 35,
	},
	selectMealView: {
		flexDirection: 'row',
		alignItems: 'center',
		position: 'absolute',
		top: 70,
		left: '50%',
		transform: [{translateX: '-50%'}],
	},
	saveSelectedButton: {
		position: 'absolute',
		top: 75,
		right: 35,
		color: '#008cffff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	searchView: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		opacity: 0,
	},
	cantFindFoodView: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignContent: 'center',
		textAlign: 'center',
		opacity: 0,
	},
	cantFindFoodText: {
		color: 'white',
		fontSize: 16,
		textAlign: 'center',
		width: '100%',
	},
	foodItemHolder: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		marginTop: '45%',
		width: '100%',
	},
	foodFlatList: {
		width: '90%',
	},
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
	addButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		borderRadius: '100%',
	},
	foodName: {
		color: 'white',
		fontSize: 26,
	},
	foodInfoText: {
		color: 'white',
		fontSize: 15,
	},
	calories: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: '10%',
		borderWidth: 2,
		width: 400,
	},
	caloriesText: {
		position: 'absolute',
		alignItems: 'center',
		borderWidth: 2,
	},
	caloriesToday: {
		color: 'white',
		fontSize: 30,
		fontWeight: 800,
	},
	totalCalories: {
		color: 'white',
		fontSize: 20,
	},
})