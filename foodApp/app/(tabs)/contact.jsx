import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'

const app = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>Coffee Shop</Text>
        <Text style={styles.description}>Here is some infromation about the coffee and stuff!</Text>
    </View>
  )
}

export default app

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    color: 'white',
    fontSize: 24,
  },
})