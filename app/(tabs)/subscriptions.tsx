import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Subscriptions = () => {
  return (
    <View>
      <Text>Subscriptions</Text>

      <Link href="/">
        Home
      </Link>
    </View>
  )
}

export default Subscriptions
