//
//  settingsView.swift
//  Food
//
//  Created by admin on 9/19/24.
//

import SwiftUI

struct settingsView: View {
    @EnvironmentObject var appstate: AppState
    var body: some View {
        ScrollView {
            ForEach(1..<10, id: \.self) { i in
                Button {
                    
                } label: {
                    Text("Settings \(i)")
                }
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding([.top, .bottom])
                .background(Color(red: 0.13, green: 0.13, blue: 0.15))
            }
        }
        .frame(maxWidth: .infinity)
        .safeAreaInset(edge: .bottom, spacing: 0) { // footer
            navigationBar()
        }
        .padding()
        .background(Gradient(colors: [Color(red: 0, green: 0, blue: 0.2), Color(red: 0.2, green: 0, blue: 0.2)]).opacity(1))
    }
}

#Preview {
    settingsView()
}
