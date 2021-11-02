import React, { PureComponent } from 'react'
import {
  Text, // Renders text
  TouchableOpacity, // Pressable container
  View // Container PureComponent
} from 'react-native'
import theme from './Theme.style'
export default class Button extends PureComponent {
  render ({ onPress } = this.props) {
    return (
      <TouchableOpacity
        style={{
          borderWidth: 2, // 2 point border widht
          borderColor: theme.otherBtnsColor, // White colored border
          margin: 5,
          width: 130,
          marginBottom: 3,
          marginTop: 0,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center'
        }}
        onPress={onPress}>
        <View
          style={{
            padding: 8,
            margin: 5,
            width: 130,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 0,
            marginBottom: 3,
            backgroundColor: 'transparent'
          }}>
          <Text
            style={{
              color: theme.otherBtnsColor,
              fontSize: theme.mediumSize + 1,
              fontWeight: '500'
            }}>
            {this.props.text.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}
