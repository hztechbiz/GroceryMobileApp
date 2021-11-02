import {
  createStackNavigator
} from 'react-navigation-stack'
import IntroScreen from '../../screens/IntroScreen'
import NewestScreen from '../../navigation/Stacks/Newest'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator(
  {
    Home: {
      screen: IntroScreen,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerShown: false,
        drawerLockMode: 'locked-closed'
      })
    },
    NewestScreen: {
      screen: NewestScreen,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    }
  }
)
export default HomeStackNavigator
