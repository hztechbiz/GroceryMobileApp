import React, {PureComponent} from 'react';
import {
  StyleSheet, // CSS-like styles
  Text, // Renders text
  Image,
  ImageBackground,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import {CardStyleInterpolators} from 'react-navigation-stack';
import {Icon} from 'native-base';
import SyncStorage from 'sync-storage';
import Swiper from '../common/Swiper';
import themeStyle from '../common/Theme.style';
import {getUrl, getHttp} from '../common/WooComFetch';
import {connect} from 'react-redux';
const WIDTH = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
class Screen extends PureComponent {
  static navigationOptions = () => ({
    headerShown: false,
    gestureEnabled: false,
    drawerLockMode: 'locked-closed',
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  });

  constructor(props) {
    super(props);
    if (SyncStorage.get('showIntroPage') === undefined) {
      SyncStorage.set('showIntroPage', '0');
      this.props.getTranslationData();
    } else {
      this.props.navigation.navigate('App');
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: themeStyle.backgroundColor}}>
        <StatusBar
          backgroundColor={themeStyle.StatusBarColor}
          barStyle="light-content"
          hidden
          borderBottomWidth={0}
        />
        <Swiper navigation={this.props.navigation} type="intro">
          {/* First screen */}
          <ImageBackground
            style={{width: WIDTH, flex: 1}}
            source={require('../images/IntroImages/intro_bg_img.png')}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <View style={{flex: 40}}>
                <Image
                  style={{
                    height: Height * 0.5,
                    width: WIDTH * 0.62,
                    marginTop: 30,
                  }}
                  resizeMode={'contain'}
                  source={require('../images/IntroImages/slide_1.png')}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 60,
                }}>
                <Icon
                  name="home"
                  style={{
                    fontSize: Height * 0.07,
                    color: themeStyle.primary,
                  }}
                />
                <Text
                  style={{
                    color: themeStyle.textColor,
                    fontFamily: 'Avenir',
                    fontSize: themeStyle.largeSize + WIDTH * 0.02,
                    fontWeight: 'bold',
                  }}>
                  Home Page
                </Text>
                <Text style={styles.text}>
                  This is the main welcome page where different sections of your
                  app will show up partially like some of the categories, offers
                  and discounts etc.
                </Text>
              </View>
            </View>
          </ImageBackground>

          {/* Second screen */}
          <ImageBackground
            style={{width: WIDTH, flex: 1}}
            source={require('../images/IntroImages/intro_bg_img.png')}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <View style={{flex: 40}}>
                <Image
                  style={{
                    height: Height * 0.5,
                    width: WIDTH * 0.62,
                    marginTop: 30,
                  }}
                  resizeMode={'contain'}
                  source={require('../images/IntroImages/slide_2.png')}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 60,
                }}>
                <Icon
                  name="apps"
                  style={{
                    fontSize: Height * 0.07,
                    color: themeStyle.primary,
                  }}
                />
                <Text
                  style={{
                    color: themeStyle.textColor,
                    fontFamily: 'Avenir',
                    fontSize: themeStyle.largeSize + WIDTH * 0.02,
                    fontWeight: 'bold',
                  }}>
                  Category Page
                </Text>
                <Text style={styles.text}>
                  This page is supposed to exhibit all the categories that you
                  deal in. this would help the visitors sort their search and
                  make it really quick.
                </Text>
              </View>
            </View>
          </ImageBackground>

          {/* Third screen */}
          <ImageBackground
            style={{width: WIDTH, flex: 1}}
            source={require('../images/IntroImages/intro_bg_img.png')}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <View style={{flex: 40}}>
                <Image
                  style={{
                    height: Height * 0.5,
                    width: WIDTH * 0.62,
                    marginTop: 30,
                  }}
                  resizeMode={'contain'}
                  source={require('../images/IntroImages/slide_3.png')}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 60,
                }}>
                <Icon
                  name="card"
                  style={{
                    fontSize: Height * 0.07,
                    color: themeStyle.primary,
                  }}
                />
                <Text
                  style={{
                    color: themeStyle.textColor,
                    fontFamily: 'Avenir',
                    fontSize: themeStyle.largeSize + WIDTH * 0.02,
                    fontWeight: 'bold',
                  }}>
                  Shop Page
                </Text>
                <Text style={styles.text}>
                  This is how your main shop page will look to others. This
                  would display your products that you sell online.
                </Text>
              </View>
            </View>
          </ImageBackground>
          {/* Fourth screen */}
          <ImageBackground
            style={{width: WIDTH, flex: 1}}
            source={require('../images/IntroImages/intro_bg_img.png')}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <View style={{flex: 40}}>
                <Image
                  style={{
                    height: Height * 0.5,
                    width: WIDTH * 0.62,
                    marginTop: 30,
                  }}
                  resizeMode={'contain'}
                  source={require('../images/IntroImages/slide_4.png')}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 60,
                }}>
                <Icon
                  name="cart"
                  style={{
                    fontSize: Height * 0.07,
                    color: themeStyle.primary,
                  }}
                />
                <Text
                  style={{
                    color: themeStyle.textColor,
                    fontFamily: 'Avenir',
                    fontSize: themeStyle.largeSize + WIDTH * 0.02,
                    fontWeight: 'bold',
                  }}>
                  Cart Page
                </Text>
                <Text style={styles.text}>
                  The cart page will show the list of all saved and shopped
                  items. User can further add or remove any items of their
                  choice here.
                </Text>
              </View>
            </View>
          </ImageBackground>

          {/* Fifth screen */}
          <ImageBackground
            style={{width: WIDTH, flex: 1}}
            source={require('../images/IntroImages/intro_bg_img.png')}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <View style={{flex: 40}}>
                <Image
                  style={{
                    height: Height * 0.5,
                    width: WIDTH * 0.62,
                    marginTop: 30,
                  }}
                  resizeMode={'contain'}
                  source={require('../images/IntroImages/slide_5.png')}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 60,
                }}>
                <Icon
                  name="list-box"
                  style={{
                    fontSize: Height * 0.07,
                    color: themeStyle.primary,
                  }}
                />
                <Text
                  style={{
                    color: themeStyle.textColor,
                    fontFamily: 'Avenir',
                    fontSize: themeStyle.largeSize + WIDTH * 0.02,
                    fontWeight: 'bold',
                  }}>
                  Order Page
                </Text>
                <Text style={styles.text}>
                  The order page will come up with a filling form for the
                  complete execution of order taking process.
                </Text>
              </View>
            </View>
          </ImageBackground>
        </Swiper>
      </View>
    );
  }
}

/// ///////////////////////////////////////
const mapDispatchToProps = (dispatch) => ({
  getTranslationData: () => {
    dispatch(async (dispatch) => {
      const json = await getHttp(getUrl() + '/api/' + 'applabels3?lang=1', {});
      dispatch({
        type: 'languageSettings',
        payload: json.data,
      });
      // }
    });
  },
});
/// ///////////////////////////////////////////////

export default connect(null, mapDispatchToProps)(Screen);
const styles = StyleSheet.create({
  // Text below header
  text: {
    color: '#4d4d4d',
    fontFamily: 'Avenir',
    fontSize: themeStyle.mediumSize + WIDTH * 0.001,
    textAlign: 'center',
    margin: 10,
  },
});
