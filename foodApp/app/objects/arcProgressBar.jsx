import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Mask, Rect, Stop } from 'react-native-svg';

export default function ArcProgressBar({ value, total = 1, name, colors, measurement }) {
	const clamp = (value, min, max) => {
		return Math.min(Math.max(value, min), max);
	};

	const percent = clamp(value / total, 0, 1) * 100;
	const overPercent = clamp((value - total) / total, 0, 1) * 100;
	const size = 95;
	const strokeWidth = 10;
	const radius = size - strokeWidth / 2;
	const circumference = 2 * Math.PI * radius;
	const arc = (300 / 360) * circumference; // 300° worth of arc
	const progress = (percent / 100) * arc;
	const overProgress = (overPercent / 100) * arc;
	
	return (
		<View style={{ alignItems: 'center', justifyContent: 'center' }}>
			<Svg width={size * 2} height={size * 2}>
				<Defs>
				<LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
					<Stop offset="0%" stopColor={colors[0]} />
					<Stop offset="100%" stopColor={colors[1]} />
					{/* "#ff7e5f" "#DA22FF" */}
					{/* "#ff7e5f" "#feb47b" */}
				</LinearGradient>
				</Defs>
				<Circle
					stroke="#333"
					fill="none"
					cx={size}
					cy={size}
					r={radius}
					strokeWidth={strokeWidth}
					strokeDasharray={`${arc} ${circumference}`}
					strokeDashoffset={0}
					strokeLinecap="round"
					rotation={120} // rotate to start at top left
					originX={size}
					originY={size}
				/>
				{progress != 0 && <Circle
					stroke="url(#grad)"
					fill="none"
					cx={size}
					cy={size}
					r={radius}
					strokeWidth={strokeWidth}
					strokeDasharray={`${progress} ${circumference}`}
					strokeDashoffset={0}
					strokeLinecap="round"
					rotation={120}
					originX={size}
					originY={size}
				/>}
				<Defs>
					<Mask id="stripeMask">
					{Array.from({ length: 30 }).map((_, i) => (
						<Rect
						key={i}
						x={0}
						y={i * 8}
						width="500"
						height="3"
						fill="white"
						/>
					))}
					</Mask>
				</Defs>
				{overProgress > 0 && 
				<Circle
					stroke="#00000080"
					fill="none"
					cx={size}
					cy={size}
					r={radius}
					strokeWidth={strokeWidth}
					strokeDasharray={`${overProgress} ${circumference}`}
					strokeDashoffset={0}
					strokeLinecap="round"
					rotation={120}
					originX={size}
					originY={size}
					mask="url(#stripeMask)"
				/>}
			</Svg>
			<View style={styles.caloriesText}>
				<Text style={styles.name}>{name}</Text>
				<Text style={styles.caloriesToday}>{Math.round(value)}{measurement}</Text>
				<Text style={styles.totalCalories}>/ {Math.round(total)}{measurement}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
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
	name: {
		color: 'white',
	}
})