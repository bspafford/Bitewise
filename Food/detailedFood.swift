//
//  detailedFood.swift
//  Food
//
//  Created by admin on 9/22/24.
//

import SwiftUI

struct detailedFood: View {
    var foodItem: FoodItem?
    
    @Binding var showNavigation: Bool
    
    @ObservedObject var globalInfo: globalInfoStruct
    @EnvironmentObject var appState: AppState
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        
        NavigationView {
            if (foodItem == nil) {
                Text("N/A")
            } else {
                ZStack(alignment: .topTrailing) {
                    ScrollView {
                        VStack (alignment: .leading) {
                            Text("\(foodItem!.description!)")
                                .font(.system(size: 50))
                                .fontWeight(.black)
                            Text("\(capitalizingFirstLetter(text: foodItem!.brandName ?? ""))")
                            
                            Divider()
                            
                            HStack {
                                Text("Serving Size")
                                Spacer()
                                Text("serving")
                            }
                            HStack {
                                Text("Number of Servings")
                                Spacer()
                                Button {
                                    
                                } label: {
                                    Text("number")
                                }
                            }
                            HStack {
                                Text("Time")
                                Spacer()
                                Button {
                                    
                                } label: {
                                    Text("time")
                                }
                            }
                            HStack {
                                Text("Meal")
                                Spacer()
                                Button {
                                    
                                } label: {
                                    Text("meal")
                                }
                            }
                            
                            foodLabel(foodItem: foodItem!)
                                .padding(20)
                            
                            Spacer()
                            
                        }
                    }
                    .clipped()
                    
                    
                    
                    //.padding(30)
                }
                .navigationBarHidden(true)
                
            }
        }
        //.navigationBarHidden(true)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    if (foodItem != nil) {
                        //globalInfo.calories += getNutrientValue(foodData: foodItem!, nutrientId: 1008) ?? 0
                        globalInfo.breakfastList.append(foodItem!)
                        showNavigation = false
                        //presentationMode.wrappedValue.dismiss()
                    }
                    print("pressed")
                } label: {
                    Image(systemName: "checkmark")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundStyle(.white)
                    
                }
                .padding(.trailing, 10)
            }
            
            
            ToolbarItem(placement: .navigationBarLeading) {
                Button {
                    //presentationMode.wrappedValue.dismiss()
                    showNavigation = false
                    //presentationMode.wrappedValue.dismiss()
                    print("pressed")
                } label: {
                    HStack {
                        Image(systemName: "chevron.backward")
                        Text("Back")
                    }
                }
                .padding(.trailing, 10)
            }
        }
        .gesture(DragGesture(minimumDistance: 30)
            .onEnded { value in
                if value.translation.width > 100 {
                    showNavigation = false
                    //dismiss() // Perform the back action on swipe right
                }
            }
        )
    }
}

struct foodLabel: View {
    var foodItem: FoodItem
    
    var body: some View {
        VStack (alignment: .leading) {
            Text("Nutrition Facts")
                .font(.system(size: 50))
                .minimumScaleFactor(0.01)
                .lineLimit(1)
                .fontWeight(.black)
                .frame(height: 60)
            Divider()
            //Text("4 servings per container")
            
            let servingSize = String(format: "%g", foodItem.servingSize ?? 0)
            let servingSizeUnit = foodItem.servingSizeUnit ?? ""
            Text("Serving size \((foodItem.householdServingFullText ?? "N/A").lowercased()) (\(servingSize)\(servingSizeUnit.lowercased()))")
                .font(.system(size: 20))
                .fontWeight(.black)
            Rectangle()
                .frame(height: 16)
            ZStack {
                HStack (alignment: .bottom){
                    VStack(alignment: .leading) {
                        Text("Amount per serving")
                            .font(.system(size: 14))
                            .fontWeight(.black)
                        Text("Calories")
                            .font(.system(size: 40))
                            .fontWeight(.black)
                    }
                    Spacer()
                }
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        
                        let calorieNum = getNutrientValue(foodData: foodItem, nutrientId: 1008)
                        Text(String(format: "%g", round(calorieNum ?? 0)))
                            .font(.system(size: 50))
                            .fontWeight(.black)
                    }
                }
            }
            .frame(height: 60)
            
            Rectangle()
                .frame(height: 8)
            HStack {
                Spacer()
                Text("% Daily Value*")
                    .fontWeight(.black)
            }
            Divider()
            HStack {
                let fatNum = getNutrientValueString(foodData: foodItem, nutrientId: 1004)
                Text("Total Fat")
                    .fontWeight(.black)
                Text("\(fatNum)")
                Spacer()
                let fatPercent = getDailyPercent(foodData: foodItem, nutrientId: 1004)
                Text("\(fatPercent)%")
                    .fontWeight(.black)
            }
            Divider()
            HStack {
                let saturatedFat = getNutrientValueString(foodData: foodItem, nutrientId: 1258)
                Text("      Saturated Fat \(saturatedFat)")
                Spacer()
                let saturatedFatPercent = getDailyPercent(foodData: foodItem, nutrientId: 1258)
                Text("\(saturatedFatPercent)%")
                    .fontWeight(.black)
            }
            Divider()
            Text("      Trans Fat \(0)")
            Divider()
            HStack {
                let cholesterol = getNutrientValueString(foodData: foodItem, nutrientId: 1253)
                Text("Cholesterol")
                    .fontWeight(.black)
                Text("\(cholesterol)")
                Spacer()
                let cholesterolPercent = getDailyPercent(foodData: foodItem, nutrientId: 1253)
                Text("\(cholesterolPercent)%")
                    .fontWeight(.black)
            }
            Divider()
            HStack {
                let sodium = getNutrientValueString(foodData: foodItem, nutrientId: 1093)
                Text("Sodium")
                    .fontWeight(.black)
                Text("\(sodium)")
                Spacer()
                let sodiumPercent = getDailyPercent(foodData: foodItem, nutrientId: 1093)
                Text("\(sodiumPercent)%")
                    .fontWeight(.black)
            }
            Divider()
            HStack {
                let carbohydrate = getNutrientValueString(foodData: foodItem, nutrientId: 1005)
                Text("Total Carbohydrate")
                    .fontWeight(.black)
                Text("\(carbohydrate)")
                Spacer()
                let carbohydratePercent = getDailyPercent(foodData: foodItem, nutrientId: 1005)
                Text("\(carbohydratePercent)%")
                    .fontWeight(.black)
            }
            Divider()
            HStack {
                let fiber = getNutrientValueString(foodData: foodItem, nutrientId: 1079)
                Text("      Dietary Fiber \(fiber)")
                Spacer()
                let fiberPercent = getDailyPercent(foodData: foodItem, nutrientId: 1079)
                Text("\(fiberPercent)%")
                    .fontWeight(.black)
            }
            Divider()
            let totalSugar = getNutrientValueString(foodData: foodItem, nutrientId: 2000)
            Text("      Total Sugars \(totalSugar)")
            Divider()
            /*
            HStack {
                let addedSugar = getNutrientValue(foodData: foodItem, nutrientId: )
                Text("          Includes \()g Added Sugars")
                Spacer()
                Text("\()%")
            }
            Divider()
             */
            HStack {
                let protein = getNutrientValueString(foodData: foodItem, nutrientId: 1003)
                Text("Protein")
                    .fontWeight(.black)
                Text("\(protein)")
                /*Spacer()
                let proteinPercent = getDailyPercent(foodData: foodItem, nutrientId: 1003)
                Text("\(proteinPercent)%")
                    .fontWeight(.black)*/
            }
            Rectangle()
                .frame(height: 16)
            HStack {
                let vitaminD = getNutrientValueString(foodData: foodItem, nutrientId: 1110)
                Text("Vitamin D \(vitaminD)")
                Spacer()
                let vitaminDPercent = getDailyPercent(foodData: foodItem, nutrientId: 1110)
                Text("\(vitaminDPercent)%")
            }
            Divider()
            HStack {
                let calcium = getNutrientValueString(foodData: foodItem, nutrientId: 1087)
                Text("Calcium \(calcium)")
                Spacer()
                let calciumPercent = getDailyPercent(foodData: foodItem, nutrientId: 1087)
                Text("\(calciumPercent)%")
            }
            Divider()
            HStack {
                let iron = getNutrientValueString(foodData: foodItem, nutrientId: 1089)
                Text("Iron \(iron)")
                Spacer()
                let ironPercent = getDailyPercent(foodData: foodItem, nutrientId: 1089)
                Text("\(ironPercent)%")
            }
            Divider()
            HStack {
                let potassium = getNutrientValueString(foodData: foodItem, nutrientId: 1092)
                Text("Potassium \(potassium)")
                Spacer()
                let potassiumPercent = getDailyPercent(foodData: foodItem, nutrientId: 1092)
                Text("\(potassiumPercent)%")
            }
            Rectangle()
                .frame(height: 8)
            Text("* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.")
            
        }
    }
}

#Preview {
    struct Preview: View {
        @State var showNavigation = false
        var body: some View {
            NavigationView {
                detailedFood(foodItem: FoodItem(description: "Name", fdcId: 123, gtinUpc: "1234567890", brandName: "Brand Name", servingSizeUnit: "g", servingSize: 99, householdServingFullText: "1g", foodNutrients: [Nutrient(nutrientId: 1008, nutrientName: "calories", unitName: "", value: 240, percentDailyValue: 9), Nutrient(nutrientId: 1004, nutrientName: "calories", unitName: "g", value: 240, percentDailyValue: 9)]), showNavigation: $showNavigation, globalInfo: globalInfoStruct(dailyCalories: 2000))
            }
        }
    }
    
    return Preview()
}
