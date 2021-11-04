import React from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import ImageLoad from './RnImagePlaceH';
import theme from './Theme.style';
const WIDTH = Dimensions.get('window').width;
const Width2 = WIDTH * 0.5;
export default Category1 = (props) => (
  <TouchableOpacity
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: theme.backgroundColor,
      backgroundColor: 'red',
      width: Width2,
      padding: 16,
      // borderColor: 'gray',
      // borderWidth: 0.2,
      shadowOffset: {width: 1, height: 1},
      shadowColor: theme.textColor,
      shadowOpacity: 0.2,
      elevation: 4,
      borderRadius: 1,
    }}
    onPress={() => props.openSubCategories(props.item, props.item.name)}>
    <ImageLoad
      key={props.id}
      style={{
        height: 100,
        width: 120,
        overflow: 'hidden',
      }}
      loadingStyle={{size: 'large', color: theme.loadingIndicatorColor}}
      placeholder={false}
      ActivityIndicator={true}
      placeholderStyle={{width: 0, height: 0}}
      backgroundColor="transparent"
      color="transparent"
      source={{uri: theme.url + '/' + props.item.image}}
    />

    <View
      style={{
        paddingTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
        backgroundColor: theme.backgroundColor,
        alignContent: 'center',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: theme.textColor,
          fontSize: theme.mediumSize,
          textAlign: 'center',
        }}>
        {props.item.name}
      </Text>
      <Text
        style={{
          color: theme.textColor,
          fontSize: theme.smallSize,
          textAlign: 'center',
        }}>{`${props.item.total_products} ${props.products}`}</Text>
    </View>
  </TouchableOpacity>
);
