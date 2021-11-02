import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native'
import ImageLoad from './RnImagePlaceH'
import theme from './Theme.style'
const WIDTH = Dimensions.get('window').width
const Width2 = WIDTH * 0.5
export default Category1 = props => (
  <TouchableOpacity
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
      width: Width2 * 0.93,
      padding: 16,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: theme.textColor,
      shadowOpacity: 0.5,
      elevation: 5,
      margin: 5,
      paddingTop: 0,
      paddingBottom: 3
    }}
    onPress={() => props.openSubCategories2(props.item)}>
    <ImageLoad
      key={props.id}
      style={{
        height: 170,
        width: Width2 * 0.93
      }}
      loadingStyle={{ size: 'large', color: theme.loadingIndicatorColor }}
      placeholder={false}
      ActivityIndicator={true}
      placeholderStyle={{ width: 0, height: 0 }}
      backgroundColor='transparent'
      color='transparent'
      source={{ uri: theme.url + '/' + props.item.image }}
    />

    <View
      style={{
        paddingTop: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
        backgroundColor: theme.backgroundColor,
        alignContent: 'center'
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: theme.textColor,
          fontSize: theme.mediumSize + 2
        }}>
        {props.item.name}
      </Text>
      <Text
        style={{
          color: 'gray',
          fontSize: theme.smallSize,
          fontWeight: '600'
        }}>{`${props.item.total_news} ${'Posts'}`}</Text>
    </View>
  </TouchableOpacity>
)
