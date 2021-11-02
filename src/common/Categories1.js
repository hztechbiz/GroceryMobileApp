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
export default (Category1 = props => (
  <TouchableOpacity style={props.noShadow ? [{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundColor,
    width: WIDTH * 0.46,
    padding: 10,
    margin: 6,
    marginTop: 12,
    marginBottom: 2,
    borderRadius: 1
  }, {
    width: !props.sizeChange ? WIDTH * 0.46 : WIDTH * 0.29,
    padding: !props.sizeChange ? 6 : 0
  }] : {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundColor,
    width: WIDTH * 0.5,
    padding: 16,
    borderColor: 'gray',
    borderWidth: 0.2,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: theme.textColor,
    shadowOpacity: 0.2,
    elevation: 1,
    borderRadius: 1
  }}
  onPress={() => props.openSubCategories(props.item, props.item.name)}>
    <ImageLoad
      key={props.id}
      style={{
        height: !props.sizeChange ? 80 : 70,
        width: !props.sizeChange ? 80 : 70,
        borderRadius: !props.sizeChange ? 80 / 2 : 70 / 2,
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
        paddingTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
        backgroundColor: theme.backgroundColor,
        alignContent: 'center'
      }}
    >
      <Text style={{ fontWeight: 'bold', color: theme.textColor, fontSize: !props.sizeChange ? theme.mediumSize : theme.smallSize, textAlign: 'center' }}>{props.item.name}</Text>
      <Text style={{ color: theme.textColor, fontSize: !props.sizeChange ? theme.smallSize : theme.smallSize - 2 }}>{`${props.item.total_products} ${
        props.products
      }`}</Text>
    </View>
  </TouchableOpacity>
))
