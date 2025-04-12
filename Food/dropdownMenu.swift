//
//  dropDownMenu.swift
//  Food
//
//  Created by admin on 9/25/24.
//

import SwiftUI

struct dropdownMenu: View {
    //@State private var selectedOption: String = "asdf"
    @State private var showPicker: Bool = false

    @Binding var selectedOption: String
    let options = ["Breakfast", "Lunch", "Dinner", "Snack"]
    
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
                Text(selectedOption)
                    //.background(Color.gray.opacity(0.2))
                    //.cornerRadius(8)
                    .foregroundColor(.white)
                    .font(.system(size: 20))
                Image(systemName: "chevron.down")
                    .foregroundColor(.white)
                    //.rotationEffect(.degrees((showDropdown ?  0 : -180)))
            }
            .frame(maxWidth: .infinity)
        }
        .pickerStyle(.menu)
        .frame(maxWidth: .infinity)
        .padding()
    }
}

#Preview {
    //dropdownMenu()
}

/*
struct  dropdownMenu: View {
    var meals = ["Select Meal", "Breakfast", "Lunch", "Dinner", "Snack"]
    //@Binding var selectedFruit: String
    @State var selectedFruit: String = "Option 1"
    @State var show: Bool = false
    
    var body: some  View {
        
        ZStack {
            Button {
                show.toggle()
            } label: {
                Text("show")
            }
            
            VStack (alignment: .trailing) {
                Spacer()
                if show {
                    Button {
                        show = false
                    } label: {
                        Image(systemName: "checkmark")
                    }
                    Picker(selection: $selectedFruit, label: EmptyView()) {
                        Text("Option 1").tag("Option 1")
                        Text("Option 2").tag("Option 2")
                        Text("Option 3").tag("Option 3")
                        /*
                         ForEach(meals, id: \.self) { fruit in
                         Button {
                         selectedFruit = fruit
                         } label: {
                         Text(fruit)
                         }
                         }
                         */
                    }
                    .pickerStyle(InlinePickerStyle())
                    .labelsHidden()
                }
            }
        }
    }
}
 */

/*
struct  dropdownMenu: View {

    let options: [String]

    var menuWdith: CGFloat  =  200
    var buttonHeight: CGFloat  =  50
    var maxItemDisplayed: Int  =  5

    @Binding  var selectedOptionIndex: Int
    @Binding  var showDropdown: Bool

    @State  private  var scrollPosition: Int?
    
    @FocusState private var test: Bool

    var body: some  View {
        VStack {
            VStack(spacing: 0) {
                // selected item
                Button(action: {
                    withAnimation {
                        showDropdown.toggle()
                    }
                }, label: {
                    HStack(spacing: nil) {
                        Text(options[selectedOptionIndex])
                        Spacer()
                        Image(systemName: "chevron.up")
                            .rotationEffect(.degrees((showDropdown ?  0 : -180)))
                    }
                })
                .padding(.horizontal, 20)
                .frame(width: menuWdith, height: buttonHeight, alignment: .leading)
                
                if (showDropdown) {
                    let scrollViewHeight: CGFloat  = options.count > maxItemDisplayed ? (buttonHeight*CGFloat(maxItemDisplayed)) : (buttonHeight*CGFloat(options.count))
                    ZStack {
                        LazyVStack(spacing: 0) {
                            ForEach(0..<options.count, id: \.self) { index in
                                Button(action: {
                                    withAnimation {
                                        selectedOptionIndex = index
                                        showDropdown.toggle()
                                    }
                                    
                                }, label: {
                                    HStack {
                                        Text(options[index])
                                        Spacer()
                                        if (index == selectedOptionIndex) {
                                            Image(systemName: "checkmark.circle.fill")
                                            
                                        }
                                    }
                                })
                                .padding(.horizontal, 20)
                                .frame(width: menuWdith, height: buttonHeight, alignment: .leading)
                                
                            }
                        }
                        .scrollTargetLayout()
                    }
                    .clipped()
                    .scrollPosition(id: $scrollPosition)
                    .scrollDisabled(options.count <=  3)
                    .frame(height: scrollViewHeight)
                    .onAppear {
                        scrollPosition = selectedOptionIndex
                    }
                }
                
            }
            .foregroundStyle(Color.white)
            .background(RoundedRectangle(cornerRadius: 16).fill(Color.black))
            
        }
        .frame(width: menuWdith, height: buttonHeight, alignment: .top)
        .zIndex(100)
    }
}
*/

