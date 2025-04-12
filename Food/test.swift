//
//  text.swift
//  Food
//
//  Created by admin on 9/21/24.
//

import SwiftUI

struct  test: View {

    let options: [String]

    var menuWdith: CGFloat  =  150
    var buttonHeight: CGFloat  =  50
    var maxItemDisplayed: Int  =  3

    @Binding  var selectedOptionIndex: Int
    @Binding  var showDropdown: Bool

    @State  private  var scrollPosition: Int?

    var body: some  View {
        VStack {
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
                        ScrollView {
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
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(.yellow)
        
    }
}

#Preview {
    struct Preview: View {
        @State var selectedOptionIndex: Int = 0
        @State var showDropdown: Bool = false
        var body: some View {
            test(options: ["Breakfast", "Lunch", "Dinner", "Snack"], selectedOptionIndex: $selectedOptionIndex, showDropdown: $showDropdown)
        }
    }
    
    return Preview()
}
