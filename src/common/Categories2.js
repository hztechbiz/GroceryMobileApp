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
export default Category2 = props => (
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
        height: 80,
        width: 80,
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
        style={{ fontWeight: 'bold', fontSize: theme.mediumSize, color: theme.textColor }}>
        {props.item.name}
      </Text>
      <Text
        style={{
          color: theme.textColor,
          fontSize: theme.smallSize,
          paddingTop: 3
        }}>{`${props.item.total_products} ${props.products}`}</Text>
    </View>
  </TouchableOpacity>
)
