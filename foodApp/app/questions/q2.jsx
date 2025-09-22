import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import WheelPicker from '../objects/wheelPicker';

export default function Q2({selectedFeet, setSelectedFeet, selectedInches, setSelectedInches, selectedGender, setSelectedGender}) {
    const feet = Array.from({length: 7}, (_, i) => (i + 3).toString());
    const inches = Array.from({length: 11}, (_, i) => (i + 1).toString());

    const maleAnim = useRef(new Animated.Value(selectedGender == "" ? 1 : (selectedGender == "Male" ? 1.12 : 0.88))).current;
    const femaleAnim = useRef(new Animated.Value(selectedGender == "" ? 1 : (selectedGender == "Female" ? 1.12 : 0.88))).current;
    const maleColor = maleAnim.interpolate({
        inputRange: [0.88, 1.12],
        outputRange: ['#595959', '#0671B7']
    })
    const femaleColor = femaleAnim.interpolate({
        inputRange: [0.88, 1.12],
        outputRange: ['#CDCDCD', '#F8B7CD']
    })

    function setGender(gender) {
        setSelectedGender(gender);
        if (gender == "Male") {
            Animated.timing(maleAnim, {
                toValue: 1.12,
                duration: 300,
                useNativeDriver: false,
            }).start();
            Animated.timing(femaleAnim, {
                toValue: 0.88,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else if (gender == "Female") {
            Animated.timing(maleAnim, {
                toValue: 0.88,
                duration: 300,
                useNativeDriver: false,
            }).start();
            Animated.timing(femaleAnim, {
                toValue: 1.12,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }

    return (
        <View>
            <View>
                <Text style={[styles.question]}>What's your gender?</Text>
            </View>
            <View style={styles.center}>
                <View style={[styles.picker, {width: '70%'}]}>
                    <View style={styles.pickerSelected}>
                        <Text style={{position: 'absolute', fontSize: 20, color: 'white', left: '29%'}}>Feet</Text>
                        <Text style={{position: 'absolute', fontSize: 20, color: 'white', left: '79%'}}>Inch</Text>
                    </View>
                    <View style={styles.pickerView}>
                        <WheelPicker selected={selectedFeet} setSelected={setSelectedFeet} list={feet}></WheelPicker>
                        <WheelPicker selected={selectedInches} setSelected={setSelectedInches} list={inches}></WheelPicker>
                    </View>
                </View>
            </View>
            <View>
                <Text style={[styles.question]}>How tall are you?</Text>
            </View>
            <View style={styles.center}>
                <View style={styles.genderQuestion}>
                    <Animated.View style={[styles.genderButton, {backgroundColor: selectedGender == "" ? '#0671B7' : maleColor, transform: [{scale: maleAnim}]}]}>
                        <Pressable onPress={() => setGender("Male")}>
                            <IconSymbol size={100} name={"figure.stand"} color={'#ffffff'} />
                            <Text style={styles.genderText}>Male</Text>
                        </Pressable>
                    </Animated.View>
                    <Animated.View style={[styles.genderButton, {backgroundColor:  selectedGender == "" ? '#F8B7CD' : femaleColor, transform: [{scale: femaleAnim}]}]}>
                        <Pressable onPress={() => setGender("Female")}>
                            <IconSymbol size={100} name={"figure.stand.dress"} color={'#ffffff'} />
                            <Text style={styles.genderText}>Female</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    question: {
        color: 'white',
        fontSize: 35,
        fontWeight: 'bold',
    },
    genderQuestion: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    genderButton: {
        width: '49%',
        aspectRatio: 1,
        borderRadius: 10,        
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
    },
    genderText: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
    },
    questionNum: {
        color: 'white',
        padding: 15,
        fontWeight: 'bold',
        fontSize: 20,
        transform: [{translateY: '-16%'}]
    },
    center: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    picker: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        overflow: 'hidden',
        paddingVertical: 20,
    },
    pickerSelected: {
        position: 'absolute',
        backgroundColor: '#ffffff30',
        width: '100%',
        height: '35',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
})