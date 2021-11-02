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
const Width2 = WIDTH
export default Category3 = props => (
  <TouchableOpacity
    style={{
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
      width: Width2,
      padding: 8,
      borderColor: 'gray',
      flexDirection: 'row'
    }}
    onPress={() => props.openSubCategories(props.item, props.item.name)}>
    <ImageLoad
      key={props.id}
      style={{
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        overflow: 'hidden',
        marginRight: 8
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
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backfaceVisibility: 'hidden',
        backgroundColor: theme.backgroundColor,
        alignContent: 'center'
      }}>
      <Text
        style={{ fontWeight: 'bold', color: theme.textColor, fontSize: theme.mediumSize }}>
        {props.item.name}
      </Text>
      <Text
        style={{
          color: theme.textColor,
          fontSize: theme.smallSize
        }}>{`${props.item.total_products} ${props.products}`}</Text>
    </View>
  </TouchableOpacity>
)
