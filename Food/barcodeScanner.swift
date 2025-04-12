//
//  barcodeScanner.swift
//  Food
//
//  Created by admin on 9/23/24.
//

// ContentView.swift
import SwiftUI
import AVFoundation

struct BarcodeScannerView: UIViewControllerRepresentable {
    class Coordinator: NSObject, AVCaptureMetadataOutputObjectsDelegate {
        var parent: BarcodeScannerView
        
        init(parent: BarcodeScannerView) {
            self.parent = parent
        }
        
        func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
            if let metadataObject = metadataObjects.first {
                guard let readableObject = metadataObject as? AVMetadataMachineReadableCodeObject else { return }
                guard let stringValue = readableObject.stringValue else { return }
                AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
                parent.didFindCode(stringValue)
            }
        }
    }
    
    var didFindCode: (String) -> Void

    func makeCoordinator() -> Coordinator {
        return Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> UIViewController {
        let viewController = UIViewController()
        let captureSession = AVCaptureSession()

        guard let videoCaptureDevice = AVCaptureDevice.default(for: .video) else { return viewController }
        let videoInput: AVCaptureDeviceInput

        do {
            videoInput = try AVCaptureDeviceInput(device: videoCaptureDevice)
        } catch {
            return viewController
        }

        if (captureSession.canAddInput(videoInput)) {
            captureSession.addInput(videoInput)
        } else {
            return viewController
        }

        let metadataOutput = AVCaptureMetadataOutput()

        if (captureSession.canAddOutput(metadataOutput)) {
            captureSession.addOutput(metadataOutput)

            metadataOutput.setMetadataObjectsDelegate(context.coordinator, queue: DispatchQueue.main)
            metadataOutput.metadataObjectTypes = [.ean8, .ean13, .pdf417, .qr] // Add more types if needed
        } else {
            return viewController
        }

        let previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer.frame = viewController.view.layer.bounds
        previewLayer.videoGravity = .resizeAspectFill
        viewController.view.layer.addSublayer(previewLayer)

        captureSession.startRunning()

        return viewController
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}

struct barcodeScannerView: View {
    @Binding var showNavigation: Bool
    
    @Environment(\.presentationMode) var presentationMode
    
    @State private var scannedCode: String?
    @ObservedObject var globalInfo: globalInfoStruct
    @State private var foodItem: FoodItem?
    @State private var navigateToDetailView = false
    @State private var cantFindFood = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                if let code = scannedCode {
                    if (!cantFindFood) {
                        ProgressView()
                    } else {
                         Text("Cannot Find: \(code)")
                         .font(.largeTitle)
                         .padding()
                    }
                    //let myfoodData = try await fetchFoodData(query: code)
                } else {
                    BarcodeScannerView {
                       self.scannedCode = $0
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity) // Adjust as needed
                }
                
                if (scannedCode == nil || cantFindFood) {
                    HStack {
                        Spacer()
                        VStack {
                            Button {
                                //presentationMode.wrappedValue.dismiss()
                                showNavigation = false
                            } label: {
                                Image(systemName: "xmark")
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 20, height: 20)
                                    .foregroundStyle(.white)
                                    .padding(15)
                                
                            }
                            Spacer()
                        }
                    }
                }
                
                //if (foodItem != nil) {
                NavigationLink(destination: detailedFood(foodItem: foodItem, showNavigation: $showNavigation, globalInfo: globalInfo), isActive: $navigateToDetailView) {
                    EmptyView()
                }
                //}
            }
            .navigationBarHidden(true)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .onChange(of: scannedCode) { newCode in
                if let code = newCode {
                    Task {
                        let foodData = try await fetchFoodData(query: code)
                        print(code)
                        
                        if (foodData != nil && foodData?.count == 0) {
                            print("bad")
                            cantFindFood = true
                        } else{
                            foodItem = foodData![0]
                            //foodItem = FoodItem(description: "Name", fdcId: 123, gtinUpc: "1234567890", brandName: "Brand Name", servingSizeUnit: "g", servingSize: 99, householdServingFullText: "1g", foodNutrients: [Nutrient(nutrientId: 1008, nutrientName: "calories", unitName: "", value: 240, percentDailyValue: 9), Nutrient(nutrientId: 1004, nutrientName: "calories", unitName: "g", value: 240, percentDailyValue: 9)])
                            navigateToDetailView = true
                            print("good")
                        }
                    }
                }
            }
        }
        .navigationBarHidden(true)
        
        

        /*
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                // cancels the barcode scan
                Button {
                    presentationMode.wrappedValue.dismiss()
                } label: {
                    Image(systemName: "xmark")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundStyle(.white)
                    
                }
                .padding(.trailing, 10)
            }
        }
         */
    }
    
    /*
    private func fetchFoodData1(for code: String) {
        Task {
            do {
                let myfoodData = try await fetchFoodData(query: code)
                // Handle the retrieved food data (e.g., store it, update the UI)
                
                print(myfoodData) // Replace with your data handling
            } catch {
                // Handle errors (e.g., show an alert)
                print("Error fetching food data: \(error.localizedDescription)")
            }
        }
    }
     */
}

#Preview {
    struct Preview: View {
        @State var test: Bool = false
        var body: some View {
            NavigationView {
                barcodeScannerView(showNavigation: $test, globalInfo: globalInfoStruct(dailyCalories: 1))
            }
        }
    }
    
    return Preview()
}
