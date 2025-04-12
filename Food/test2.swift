//
//  test2.swift
//  Food
//
//  Created by admin on 9/25/24.
//

import SwiftUI

struct test2: View {
    //@State private var selectedOption: String = "asdf"
    @State private var showPicker: Bool = false

    @State private var selectedOption: String = "Option 1"
    let options = ["Option 1", "Option 2", "Option 3"]
    
    var body: some View {
        VStack {
            Menu {
                ForEach(options, id: \.self) { option in
                    Button(action: {
                        selectedOption = option
                    }) {
                        Text(option)
                    }
                }
            } label: {
                Text("+")
                    .padding()
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(8)
                    .foregroundColor(.black)
            }
            .frame(maxWidth: .infinity)
            .padding()
        }
        .pickerStyle(.menu)
        .padding()
    }
}

#Preview {
    struct Preview: View {
        @State var selectedOptionIndex: Int = 0
        @State var showDropdown: Bool = false
        var body: some View {
            test2()
        }
    }
    
    return Preview()
}
