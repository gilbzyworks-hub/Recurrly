import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Settings = () => {
  return (
    <View>
      <Text>Settings</Text>

      <Link href="/">
        Home
      </Link>
    </View>
  )
}

export default Settings
