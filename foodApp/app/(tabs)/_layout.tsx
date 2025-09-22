import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
		initialRouteName='index' // set default
		screenOptions={{
			tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
			tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tint,
			headerShown: false,
			tabBarButton: HapticTab,
			tabBarStyle: {
			position: 'absolute',
				// Use a transparent background on iOS to show the blur effect
				backgroundColor: '#00000000',//#008cff',
				borderTopWidth: 0,
				elevation: 0,
			},
		}}>
		<Tabs.Screen
		name="weight"
		options={{
			title: 'Weight',
			tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={focused ? "heart.fill" : "heart"} color={color} />,
		}}
		/>
		<Tabs.Screen
			name="index"
			options={{
			title: 'Home',
			tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={focused ? "house.fill" : "house"} color={color} />,
			}}
		/>
		<Tabs.Screen
		name="journal"
		options={{
			title: 'Journal',
			tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={focused ? "book.fill" : "book"} color={color} />,
		}}
		/>
		<Tabs.Screen
			name="contact"
			options={{
			title: 'Contact',
			tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={focused ? "gearshape.fill" : "gearshape"} color={color} />,
			}}
		/>
		</Tabs>
	);
}
