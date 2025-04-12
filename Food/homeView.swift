//
//  Main.swift
//  Food
//
//  Created by admin on 9/19/24.
//

import SwiftUI

struct homeView: View {
    @EnvironmentObject var appState: AppState
    
    //@State private var progress = calories / dailyCalories
    //@Binding var dailyCalories: Double
    //@Binding var calories: Double
    @ObservedObject var globalInfo: globalInfoStruct
    
    @State private var searchQuery: String = ""
    @FocusState private var isSearchBarFocused: Bool
    
    var body: some View {
        ZStack {
            CircularProgressBar(progress: globalInfo.calcTotalCalories() / globalInfo.dailyCalories)
            VStack {
                Text("\(Int(round(globalInfo.dailyCalories - globalInfo.calcTotalCalories())))")
                    .font(.system(size: 36))
                    .fontWeight(.black)
                Text("Remaining")
            }
            
        }
        //.padding([.top, .leading, .trailing])
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        //.background()
        
        .safeAreaInset(edge: .bottom, spacing: 0) { // footer
            navigationBar()
        }
        .padding()
        .background(Gradient(colors: [Color(red: 0, green: 0, blue: 0.2), Color(red: 0.2, green: 0, blue: 0.2)]).opacity(1))
    }
}

struct CircularProgressBar: View {
    var progress: Double // Progress value from 0.0 to 1.0
    
    var body: some View {
        ZStack {
            Circle()
                .stroke(lineWidth: 24)
                .frame(width: 200, height: 200)
                //.foregroundColor(Color(red: 0.63, green: 0.6, blue: 0.64))
                .foregroundColor(Color(red: 0.15, green: 0.15, blue: 0.3))
            Circle()
                .trim(from: 0, to: progress)
                .stroke(style: StrokeStyle(lineWidth: 24, lineCap: .round))
                .frame(width: 200, height: 200)
                .rotationEffect(.degrees(-90))
                .foregroundColor(Color(red: 0.6, green: 0, blue: 1))
            
        }
    }
}

#Preview {
    homeView(globalInfo: globalInfoStruct(dailyCalories: 2000))
}
