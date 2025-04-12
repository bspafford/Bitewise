//
//  diaryView.swift
//  Food
//
//  Created by admin on 9/24/24.
//

import SwiftUI

struct diaryView: View {
    @Binding var globalInfo: globalInfoStruct
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        VStack {
            HStack {
                Text("Calories Remaining")
                Spacer()
                Text("\(Int(round(globalInfo.dailyCalories - globalInfo.calcTotalCalories())))")
            }
            
            ScrollView {
                VStack {
                    HStack (alignment: .bottom) {
                        Text("Breakfast")
                            .font(.title)
                        Spacer()
                        Text(getMealCalories(mealList: globalInfo.breakfastList))
                            .font(.title2)
                            .fontWeight(.bold)
                    }
                    Divider()
                    if (globalInfo.breakfastList.count > 0) {
                        ForEach(0..<globalInfo.breakfastList.count, id: \.self) { i in
                            Button {
                                
                            } label: {
                                foodDiaryBlock(globalInfo: $globalInfo, foodData: globalInfo.breakfastList[i])
                            }
                        }
                    }
                }

                VStack {
                    HStack (alignment: .bottom) {
                        Text("Lunch")
                            .font(.title)
                        Spacer()
                        Text(getMealCalories(mealList: globalInfo.lunchList))
                            .font(.title2)
                            .fontWeight(.bold)
                    }
                    Divider()
                    if (globalInfo.lunchList.count > 0) {
                        ForEach(0..<globalInfo.lunchList.count, id: \.self) { i in
                            Button {
                                
                            } label: {
                                foodDiaryBlock(globalInfo: $globalInfo, foodData: globalInfo.lunchList[i])
                            }
                        }
                    }
                }
                
                VStack {
                    HStack (alignment: .bottom) {
                        Text("Dinner")
                            .font(.title)
                        Spacer()
                        Text(getMealCalories(mealList: globalInfo.dinnerList))
                            .font(.title2)
                            .fontWeight(.bold)
                    }
                    Divider()
                    if (globalInfo.dinnerList.count > 0) {
                        ForEach(0..<globalInfo.dinnerList.count, id: \.self) { i in
                            Button {
                                
                            } label: {
                                foodDiaryBlock(globalInfo: $globalInfo, foodData: globalInfo.dinnerList[i])
                            }
                        }
                    }
                }

                VStack {
                    HStack (alignment: .bottom) {
                        Text("Snack")
                            .font(.title)
                        Spacer()
                        Text(getMealCalories(mealList: globalInfo.snackList))
                            .font(.title2)
                            .fontWeight(.bold)
                    }
                    Divider()
                    if (globalInfo.snackList.count > 0) {
                        ForEach(0..<globalInfo.snackList.count, id: \.self) { i in
                            Button {
                                
                            } label: {
                                foodDiaryBlock(globalInfo: $globalInfo, foodData: globalInfo.snackList[i])
                            }
                        }
                    }
                }
            }
            .clipped()
        }
        .safeAreaInset(edge: .bottom, spacing: 0) { // footer
            navigationBar()
        }
        .padding()
        .background(Gradient(colors: [Color(red: 0, green: 0, blue: 0.2), Color(red: 0.2, green: 0, blue: 0.2)]).opacity(1))
    }
    
    func getMealCalories(mealList: [FoodItem]) -> String {
        var calories: Double = 0
        for meal in mealList {
            let value = getNutrientValue(foodData: meal, nutrientId: 1008)
            calories += value ?? 0
        }
        
        return String(format: "%g", round(calories))
    }
}

#Preview {
    struct Preview: View {
        @State var globalInfo = globalInfoStruct(dailyCalories: 1)
        var body: some View {
            diaryView(globalInfo: $globalInfo)
        }
    }
    
    return Preview()
}
