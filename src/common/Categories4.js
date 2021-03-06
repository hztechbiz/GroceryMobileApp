import React from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import ImageLoad from './RnImagePlaceH';
import theme from './Theme.style';
const WIDTH = Dimensions.get('window').width;
const Width2 = WIDTH * 0.42;
export default Category1 = (props) => (
  <TouchableOpacity
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'red',
      // backgroundColor: '#fff',
      // margin: 5,
      marginHorizontal: 5,
      // marginVertical: 1,
      height: 120,
      width: Width2,
      // opacity: 15,
      // padding: 16,

      // borderColor: 'gray',
      // borderWidth: 0.2,
      shadowOffset: {width: 1, height: 1},
      shadowColor: theme.textColor,
      shadowOpacity: 0.2,
      // elevation: 4,
      borderRadius: 10,
    }}
    onPress={() => props.openSubCategories(props.item, props.item.name)}>
    <View
      style={{
        // position: 'absolute',
        // color: 'black',
        // top: 0,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        borderRadius: 12,
        // flex: 1,
      }}>
      <ImageLoad
        key={props.id}
        style={{
          height: 110,
          width: Width2,
          overflow: 'hidden',
          borderRadius: 12,
          opacity: 0.5,
        }}
        // resizeMethod="contain"
        loadingStyle={{size: 'large', color: theme.loadingIndicatorColor}}
        placeholder={false}
        ActivityIndicator={true}
        placeholderStyle={{width: 0, height: 0}}
        backgroundColor="transparent"
        color="transparent"
        source={{uri: theme.image_url + '/' + props.item.image}}
      />
    </View>

    <View
      style={{
        position: 'absolute',
        top: 40,
        // paddingTop: 15,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backfaceVisibility: 'hidden',
        // backgroundColor: theme.backgroundColor,
        // alignContent: 'center',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          // color: theme.textColor,
          color: '#fff',
          fontSize: theme.mediumSize,
          textAlign: 'center',
        }}>
        {props.item.name}
      </Text>
      <Text
        style={{
          // color: theme.textColor,
          color: '#fff',
          fontSize: theme.smallSize,
          textAlign: 'center',
        }}>{`${props.item.total_products} ${props.products}`}</Text>
    </View>
  </TouchableOpacity>
);
