import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const message = () => {
  return (
    <SafeAreaView className="h-full px-4 pt-10">
      <View>
        <Text className="text-4xl text-black font-cbold">Message</Text>
        
      </View>
    </SafeAreaView>
  )
}

export default message