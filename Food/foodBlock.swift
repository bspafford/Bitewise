//
//  foodBlock.swift
//  Food
//
//  Created by admin on 9/25/24.
//

import SwiftUI

struct foodBlock: View {
    @Binding var globalInfo: globalInfoStruct
    
    @Binding var mealOption: String
    @Binding var showDropdown: Bool
    
    let options = ["Breakfast", "Lunch", "Dinner", "Snack"]
    
    @Environment(\.colorScheme) var colorScheme
    var foodData: FoodItem
    
    var body: some View {
        ZStack() {
            ZStack(alignment: .leading) {
                VStack(alignment: .leading) { // food list
                    Text("\(capitalizingFirstLetter(text: foodData.description ?? "N/A"))")
                        .font(.largeTitle)
                        .multilineTextAlignment(.leading)
                        .foregroundStyle(.white)
                    
                    Text(getFoodItemDescription(foodData: foodData))
                        .font(.footnote)
                        .foregroundStyle(.white)
                }
                HStack {
                    Spacer()
                    if (mealOption == "Select Meal") {
                        Menu {
                            ForEach(options, id: \.self) { option in
                                Button(action: {
                                    mealOption = option
                                    // also adds food
                                    addFood(foodData: foodData, mealOption: mealOption, globalInfo: &globalInfo)
                                }) {
                                    Text(option)
                                }
                            }
                        } label: {
                            Text("+")
                        }
                        .font(.system(size: 30))
                        .foregroundStyle(.white)
                        .background(Circle()
                            .fill(Color(red: 0.15, green: 0.15, blue: 0.3))
                            .frame(width: 65, height: 65)
                            .controlSize(.large)
                        )
                        .padding(.trailing, 20)
                    } else {
                        Button ("+") {
                            addFood(foodData: foodData, mealOption: mealOption, globalInfo: &globalInfo)
                        }
                        .font(.system(size: 30))
                        .foregroundStyle(.white)
                        .background(Circle()
                            .fill(Color(red: 0.15, green: 0.15, blue: 0.3))
                            .frame(width: 65, height: 65)
                            .controlSize(.large)
                        )
                        .padding(.trailing, 20)
                    }
                }
            }
            .padding(20)
        }
        .background(
            Rectangle()
                .fill(.black)
                .cornerRadius(20)
                .shadow(color: .white.opacity(0.1), radius: 10, x: 0, y: 0)
        )
        .padding([.leading, .trailing])
    }
    
    func addFood(foodData: FoodItem, mealOption: String, globalInfo: inout globalInfoStruct) {
        if (mealOption == "Breakfast") {
            globalInfo.breakfastList.append(foodData)
        } else if (mealOption == "Lunch") {
            globalInfo.lunchList.append(foodData)
        } else if (mealOption == "Dinner") {
            globalInfo.dinnerList.append(foodData)
        } else if (mealOption == "Snack") {
            globalInfo.snackList.append(foodData)
        }
    }
}

struct foodDiaryBlock: View {
    @Binding var globalInfo: globalInfoStruct
    var foodData: FoodItem
    
    var body: some View {
        ZStack {
            ZStack(alignment: .leading) {
                HStack {
                    VStack(alignment: .leading) { // food list
                        Text("\(capitalizingFirstLetter(text: foodData.description ?? "N/A"))")
                            .font(.title2)
                            .multilineTextAlignment(.leading)
                            .foregroundStyle(.white)
                        
                        Text(getFoodItemDescription(foodData: foodData))
                            .font(.caption2)
                            .foregroundStyle(.white)
                    }
                    Spacer()
                }
            }
            .frame(maxWidth: .infinity)
            .padding()
            HStack {
                Spacer()
                Text(String(format: "%g", round(getNutrientValue(foodData: foodData, nutrientId: 1008) ?? 0)))
                    .foregroundStyle(.white)
                    .padding()
            }
        }
        .background(
            Rectangle()
                .fill(.black)
                .cornerRadius(20)
                .shadow(color: .white.opacity(0.1), radius: 10, x: 0, y: 0)
        )
        //.padding([.leading, .trailing])
    }
}

#Preview {
    struct Preview: View {
        @State var globalInfo = globalInfoStruct(dailyCalories: 1000)
        
        var body: some View {
            foodDiaryBlock(globalInfo: $globalInfo, foodData: FoodItem(description: "temp", fdcId: 123, gtinUpc: "123", brandName: "asdf", servingSizeUnit: "g", servingSize: 3, householdServingFullText: "1g", foodNutrients: []))
        }
    }
    
    return Preview()
}
