//
//  FoodApp.swift
//  Food
//
//  Created by admin on 9/18/24.
//

import SwiftUI

class AppState: ObservableObject {
    @Published var screen: Int
    
    init(screen: Int) {
        self.screen = screen
    }
}

struct navigationBar: View {
    @EnvironmentObject var appstate: AppState
    
    var body: some View {
        HStack {
            Button {
                appstate.screen = 0;
            } label: {
                Image(systemName: "house")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 30, height: 30)
                    .padding(.leading)
                    .foregroundStyle(.white)
            }
            
            Spacer()
            
            Button {
                appstate.screen = 1;
                print("searchQuery1")
            } label: {
                Image(systemName: "fork.knife")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 30, height: 30)
                    //.padding([.trailing, .leading], 70)
                    .padding()
                    .foregroundStyle(.white)
            }
            
            Spacer()
            
            Button {
                appstate.screen = 2;
                print("searchQuery1")
            } label: {
                Image(systemName: "book")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 30, height: 30)
                    //.padding([.trailing, .leading], 70)
                    .padding()
                    .foregroundStyle(.white)
            }
            
            Spacer()
            
            Button {
                appstate.screen = 3;
            } label: {
                Image(systemName: "ellipsis")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 30, height: 30)
                    .padding(.trailing)
                    .foregroundStyle(.white)
            }
        }
        
    }
}

struct searchBar: View {
    @Binding var showNavigation: Bool
    @Binding var searchQuery: String
    @Binding var foodDataList: [FoodItem]
    @FocusState var isSearchBarFocused: Bool
    
    var body: some View {
        VStack {
            //Spacer()
            HStack {
                Image(systemName: "magnifyingglass")
                TextField("Search...", text: $searchQuery)
                    .modifier(TextFieldClearButton(text: $searchQuery, showNavigation: $showNavigation, isFocused: isSearchBarFocused))
                    .focused($isSearchBarFocused)
                    .onTapGesture {
                        isSearchBarFocused = true
                    }
                    .onSubmit {
                        Task {
                            //@StateObject var foodClass = FoodViewModel()
                            let myfoodData = try await fetchFoodData(query: searchQuery)
                            foodDataList = myfoodData ?? []
                            
                            //FoodViewModel
                            searchQuery = ""
                            isSearchBarFocused = false;
                        }
                    }
            }
            .padding(10)
            //.background(Color(red: 0.15, green: 0.15, blue: 0.18))
            .background(Color(red: 0.0, green: 0.0, blue: 0.0))
            .cornerRadius(20)
            .shadow(color: .white.opacity(0.25), radius: 10, x: 0, y: 0)
            
            if !isSearchBarFocused {
            navigationBar()
            }
        }
        .padding()
        .frame(maxWidth: .infinity)
        //.background(Color(red: 0.05, green: 0, blue: 0.05))
        .dismissKeyboardOnSwipeDown()
    }
}

class globalInfoStruct: ObservableObject {
    @Published var dailyCalories: Double
    //@Published var calories: Double
    @Published var breakfastList: [FoodItem] = []
    @Published var lunchList: [FoodItem] = []
    @Published var dinnerList: [FoodItem] = []
    @Published var snackList: [FoodItem] = []
    
    init(dailyCalories: Double) {
        self.dailyCalories = dailyCalories
        //self.calories = calories
    }
    
    func calcTotalCalories() -> Double {
        var calories = 0.0
        for breakfast in breakfastList {
            calories += getNutrientValue(foodData: breakfast, nutrientId: 1008) ?? 0
        }
        for lunch in lunchList {
            calories += getNutrientValue(foodData: lunch, nutrientId: 1008) ?? 0
        }
        for dinner in dinnerList {
            calories += getNutrientValue(foodData: dinner, nutrientId: 1008) ?? 0
        }
        for snack in snackList {
            calories += getNutrientValue(foodData: snack, nutrientId: 1008) ?? 0
        }
        
        return calories
    }
}

@main
struct FoodApp: App {
    init() {
        globalInfo = globalInfoStruct(dailyCalories: 2000)
    }
    
    @ObservedObject var appState = AppState(screen: 0)
    
    //@State public var dailyCalories = 2000.0
    //@State public var calories = 1250.0
    @State var globalInfo: globalInfoStruct
    @State var selectedOption: String = "Select Meal"
    
    var body: some Scene {
        WindowGroup {
            //barcodeScannerView()
            //test()
            //*
            if appState.screen == 0 {
                homeView(globalInfo: globalInfo/*dailyCalories: $dailyCalories, calories: $calories*/)
                    .environmentObject(appState)
            } else if appState.screen == 1 {
                ContentView(globalInfo: $globalInfo, selectedOption: $selectedOption)
                    .environmentObject(appState)
            } else if appState.screen == 2 {
                diaryView(globalInfo: $globalInfo)
                    .environmentObject(appState)
            } else if appState.screen == 3 {
                settingsView()
                    .environmentObject(appState)
            }
             //*/
            
        }
    }
}

#Preview {
    //ContentView(globalInfo: globalInfoStruct(dailyCalories: 2000))
}
