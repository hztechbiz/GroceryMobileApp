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
const HEIGHT = Dimensions.get('window').height
export default Category1 = props => (
  <TouchableOpacity
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
      padding: 5
    }}
    onPress={() => props.openSubCategories(props.item, props.item.name)}>
    <ImageLoad
      resizeMode='cover'
      key={props.id}
      style={{
        height: HEIGHT * 0.28,
        width: props.viewButton ? WIDTH * 0.473 : WIDTH * 0.43,
        overflow: 'hidden'
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
        marginTop: 1,
        paddingTop: 8,
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
          fontSize: theme.smallSize,
          textAlign: 'center'
        }}>
        {props.item.name}
      </Text>
      <Text
        style={{
          color: theme.textColor,
          fontSize: theme.smallSize - 2,
          textAlign: 'center'
        }}>{`${props.item.total_products} ${props.products}`}</Text>
    </View>
  </TouchableOpacity>
)
