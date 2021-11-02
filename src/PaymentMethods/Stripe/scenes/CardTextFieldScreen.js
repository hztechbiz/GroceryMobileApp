import React, { PureComponent } from 'react'
import { View, Text, Platform, StyleSheet } from 'react-native'
import stripe, { PaymentCardTextField } from 'tipsi-stripe'
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'

import Spoiler from '../components/Spoiler'
import ThemeStyle from '../../../common/Theme.style'

const ContainerView = Platform.select({
  ios: View,
  android: View
})

export default class CardTextFieldScreen extends PureComponent {
  static title = 'Card Text Field'

  state = {
    valid: false,
    loading: false,
    token: null,
    error: null,
    params: {
      number: '',
      expMonth: 0,
      expYear: 0,
      cvc: ''
    }
  }

  handleFieldParamsChange = (valid, params) => {
    this.props.setParams(params)
    this.setState({
      valid,
      params
    })
  }

  render () {
    const { valid, params, loading, token, error } = this.state

    return (
      <ContainerView
        behavior='padding'
        style={styles.container}
        onResponderGrant={dismissKeyboard}
        onStartShouldSetResponder={() => true}>
        <View>
          <PaymentCardTextField
            accessible={false}
            style={styles.field}
            onParamsChange={this.handleFieldParamsChange}
            numberPlaceholder='XXXX XXXX XXXX XXXX'
            expirationPlaceholder='MM/YY'
            cvcPlaceholder='CVC'
          />
          <Spoiler title='Params' style={styles.spoiler}>
            <View style={styles.params}>
              <Text style={styles.instruction}>Valid: {String(valid)}</Text>
              <Text style={styles.instruction}>
                Number: {params.number || '-'}
              </Text>
              <Text style={styles.instruction}>
                Month: {params.expMonth || '-'}
              </Text>
              <Text style={styles.instruction}>
                Year: {params.expYear || '-'}
              </Text>
              <Text style={styles.instruction}>CVC: {params.cvc || '-'}</Text>
            </View>
          </Spoiler>
        </View>
      </ContainerView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  token: {
    height: 20
  },
  spoiler: {
    width: 300
  },
  params: {
    alignItems: 'flex-start',
    backgroundColor: ThemeStyle.backgroundColor,
    borderRadius: 10,
    padding: 10,
    margin: 5
  },
  field: {
    width: 300,
    color: '#449aeb',
    borderColor: ThemeStyle.textColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: ThemeStyle.backgroundColor
  }
})
