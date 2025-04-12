//
//  ContentView.swift
//  Food
//
//  Created by admin on 9/18/24.
//

import SwiftUI

struct DismissKeyboardOnSwipeDown: ViewModifier {
    func body(content: Content) -> some View {
        content
            .gesture(DragGesture().onChanged { value in
                if value.translation.height > 50 { // Check for downward swipe
                    UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                }
            })
    }
}

extension View {
    func dismissKeyboardOnSwipeDown() -> some View {
        self.modifier(DismissKeyboardOnSwipeDown())
    }
}

struct OvalTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding(10)
            .background(Color(red: 0.2, green: 0.2, blue: 0.3))
            .cornerRadius(20)
    }
}

struct TextFieldClearButton: ViewModifier {
    @Binding var text: String
    @Binding var showNavigation: Bool
    var isFocused: Bool
    
    func body(content: Content) -> some View {
        HStack {
            content
            
            if !text.isEmpty {
                Button(
                    action: { self.text = "" },
                    label: {
                        Image(systemName: "xmark")
                            .foregroundColor(Color(UIColor.opaqueSeparator))
                    }
                )
            } else if !isFocused {
                //NavigationLink(destination: barcodeScannerView()) {
                Button {
                    showNavigation = true
                } label: {
                    Image(systemName: "barcode.viewfinder")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .padding([.trailing, .leading], 5)
                        .foregroundStyle(.white)
                }
            }
        }
    }
}

struct NoButtonStyle: ButtonStyle {
    func makeBody(configuration: Self.Configuration) -> some View {
        return configuration.label
    }
}



func getFoodItemDescription(foodData: FoodItem) -> String {
    let calorieNutrient = findNutrient(foodData: foodData, nutrientId: 1008)
    
    let servingSize = foodData.servingSize ?? 100 // if not serving size then make it 100
    
    var textString = ""
    if (calorieNutrient != nil) {
        textString = "\(Int(round((calorieNutrient?.value ?? 0) / 100 * servingSize)))"
    }
    if (foodData.servingSize != nil) {
        textString += ", " + String(format: "%g", foodData.servingSize!) + (foodData.servingSizeUnit ?? "")
    }
    if (foodData.brandName != nil && foodData.brandName != "") {
        textString += ", " + (capitalizingFirstLetter(text: foodData.brandName!))
    }
    
    return textString
}

func findNutrient(foodData: FoodItem, nutrientId: Int) -> Nutrient? {
    for nutrient in foodData.foodNutrients {
        if nutrient.nutrientId == nutrientId {
            return nutrient
        }
    }
    
    return nil
}

func getNutrientValueString(foodData: FoodItem, nutrientId: Int) -> String {
    let nutrientValue = getNutrientValue(foodData: foodData, nutrientId: nutrientId)
    if (nutrientValue != nil) {
        let servingSizeUnit = findNutrient(foodData: foodData, nutrientId: nutrientId)!.unitName?.lowercased()
        let roundedValue = roundToTenths(value: nutrientValue!)
        return "\(String(format: "%g", roundedValue))\(servingSizeUnit!)"
    } else {
        return "N/A"
    }
}

// returns the correct value calculated after serving size
func getNutrientValue(foodData: FoodItem, nutrientId: Int) -> Double? {
    let nutrient = findNutrient(foodData: foodData, nutrientId: nutrientId)
    let servingSize = foodData.servingSize ?? 100 // if not serving size then make it 100
    
    if (nutrient != nil) {
        return Double((nutrient?.value ?? 0) / 100 * servingSize)
    }
    
    return nil
}

// returns the daily percent of the nutrients after serving size
func getDailyPercent(foodData: FoodItem, nutrientId: Int) -> String {
    let nutrient = findNutrient(foodData: foodData, nutrientId: nutrientId)
    let servingSize = foodData.servingSize ?? 100 // if not serving size then make it 100
    var string = ""
    
    if (nutrient != nil) {
        //print((Float(nutrient?.percentDailyValue ?? 0)) / 100.0 * servingSize)
        let percent = round(Float(nutrient?.percentDailyValue ?? 0) / 100.0 * servingSize)
        if nutrient!.value == 0 {
            string = "0"
        } else if percent < 1 {
            string = "<1"
        } else {
            string = String(format: "%g", percent)
        }
    } else {
        string = "N/A"
    }
    
    return string
}

func roundToTenths(value: Double) -> Double {
    return (value * 10.0).rounded() / 10.0
}

struct ContentView: View {
    @State var showNavigation: Bool = false
    @State var testNav: Bool = false
    @State var foodTest: FoodItem? = nil
    
    @Binding var globalInfo: globalInfoStruct
    
    @EnvironmentObject var appState: AppState
    
    @State private var foodDataList: [FoodItem] = [] // should be the most recent searches
    @State private var searchQuery: String = ""
    
    var mealOptions = ["Select Meal", "Breakfast", "Lunch", "Dinner", "Snack"]
    @Binding var selectedOption: String
    @State private var showDropdown: Bool = false;
    
    
    var body: some View {
        NavigationStack {
            VStack(alignment: .leading) {
                //dropdownMenu(options: mealOptions, selectedOptionIndex: $selectedOptionIndex, showDropdown: $showDropdown)
                //dropdownMenu(selectedFruit: $selectedOption)
                //    .frame(maxWidth: .infinity)
                dropdownMenu(selectedOption: $selectedOption)
                
                ScrollView {
                    VStack(alignment: .leading) {
                        if foodDataList.count > 0 {
                            ForEach(1..<foodDataList.count) { i in
                                Button {
                                    foodTest = foodDataList[i]
                                    testNav = true
                                    print("pressing something \(i)")
                                } label: {
                                    foodBlock(globalInfo: $globalInfo, mealOption: $selectedOption, showDropdown: $showDropdown, foodData: foodDataList[i])
                                }
                            }
                        } else { // temp
                            ForEach(1..<10) { i in
                                //foodBlock(globalInfo: globalInfoStruct(dailyCalories: 2000), mealOption: $selectedOption, showDropdown: $showDropdown, foodData: FoodItem(description: "temp \(i)", fdcId: 123, gtinUpc: "123", brandName: "asdf", servingSizeUnit: "g", servingSize: 3, householdServingFullText: "1g", foodNutrients: []))
                            }
                        }
                        
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .clipped()
                
                searchBar(showNavigation: $showNavigation, searchQuery: $searchQuery, foodDataList: $foodDataList)
            }
            .frame(maxWidth: .infinity)
            .background(Gradient(colors: [Color(red: 0, green: 0, blue: 0.2), Color(red: 0.2, green: 0, blue: 0.2)]).opacity(1))
            
            NavigationLink(destination: barcodeScannerView(showNavigation: $showNavigation, globalInfo: globalInfo), isActive: $showNavigation) {
                EmptyView()
            }
            
            NavigationLink(destination: detailedFood(foodItem: foodTest, showNavigation: $testNav, globalInfo: globalInfo), isActive: $testNav) {
                EmptyView()
            }
        }
    }
}

struct FoodData: Codable {
    let foods: [FoodItem]
}

struct FoodItem: Codable {
    let description: String?
    let fdcId: Int?
    let gtinUpc: String?
    let brandName: String?
    let servingSizeUnit: String?
    let servingSize: Float?
    let householdServingFullText: String?
    let foodNutrients: [Nutrient]
}

struct Nutrient: Codable {
    let nutrientId: Int?
    let nutrientName: String?
    let unitName: String?
    let value: Float?
    let percentDailyValue: Int?
}

func fetchFoodData(query: String) async throws -> [FoodItem]? {
    let apiKey = "*******************************"
    guard let url = URL(string: "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=\(apiKey)") else { return nil }
    
    // Create URL request
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    
    // Set up the query parameters
    let parameters: [String: Any] = [
        "query": query,
        "pageSize": 25
    ]
    
    // Convert parameters to JSON data
    do {
        let jsonData = try JSONSerialization.data(withJSONObject: parameters, options: [])
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = jsonData
        
    } catch {
        print("Error serializing JSON: \(error)")
        return nil
    }
    
    let (data, response) = try await URLSession.shared.data(for: request)
    
    // Check for a valid response
    guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
        throw URLError(.badServerResponse)
    }
    
    let foodData = try JSONDecoder().decode(FoodData.self, from: data)
    
    return foodData.foods
}

func capitalizingFirstLetter(text: String) -> String {
    // Split the input into words
        let words = text.lowercased().split(separator: " ")
        
        // Capitalize the first letter of each word and join them back together
        let capitalizedWords = words.map { word in
            word.prefix(1).uppercased() + word.dropFirst()
        }
        
        return capitalizedWords.joined(separator: " ")
    //return text.prefix(1).uppercased() + text.dropFirst().lowercased()
}

#Preview {
    struct Preview: View {
        @State var globalInfo: globalInfoStruct = globalInfoStruct(dailyCalories: 2000)
        @State var selectedOption = "Select Meal"
        var body: some View {
            ContentView(globalInfo: $globalInfo, selectedOption: $selectedOption)
        }
    }
    
    return Preview()
}
