import { CommonActions, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { InteractionManager, View } from 'react-native';
import { useData } from './data/userData';

export default function asdf() {
    const { userData, hasLoaded, calcMaxDailyCalories } = useData();

    const navigation = useNavigation();
    
    useEffect(() => {
        if (!hasLoaded)
            return;

        let goTo = 'questions';

        console.log("max calories: ", calcMaxDailyCalories());
        if (userData.year != 0)
            goTo = '(tabs)';

        const task = InteractionManager.runAfterInteractions(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: goTo }],
                })
            );
        });
        return () => task.cancel(); // clean up
    }, [hasLoaded]);

    return (
        <View>
        </View>
    )
}