import SyncStorage from 'sync-storage'
const CouponProvider = {
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< All below services are used for coupon >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //= =======================================================================================================
  //= ============================== service to calculate line items total ==============================
  lineItemTotalService (lineItems) {
    let total = 0
    for (const value of lineItems) {
      const subtotal = parseFloat(value.total)
      total += subtotal
    }
    return total
  },
  //= =======================================================================================================
  //= ============================== service to calculate line items total ==============================
  checkOnSaleService (lineItems, coupon) {
    if (coupon.exclude_sale_items == 0 || coupon.exclude_sale_items == '') { return false }
    let found = false
    lineItems.some((value, index) => { /// ////////////////////////////////////
      if (value.on_sale == true) { found = true }
    })
    if (found && coupon.discount_type == 'fixed_cart') { return true } else if (found && coupon.discount_type == 'percent') { return true }
    return false
  },
  //= =======================================================================================================
  //= ============================== service to calculate line items total ==============================
  emailCheckService (emailList) {
    if (emailList.length === 0) return false
    let found = false
    for (const value of emailList) {
      if (value === SyncStorage.get('customerData').email) {
        found = true
        return true
      }
    }
    return found
  },
  //= =======================================================================================================
  //= ============================== service to calculate line items total ==============================
  checkCategoriesService (value, coupon) {
    if (coupon.product_categories.length === 0 && coupon.excluded_product_categories.length === 0) { return true }
    var categoryId = value.categories_id
    let found = 0
    for (const y of coupon.product_categories) {
      if (categoryId == y) { found++ }
      // }
    }
    if (coupon.product_categories.length === 0) {
      found++
    }
    let found2 = 0
    for (const y of coupon.excluded_product_categories) {
      if (categoryId == y) { found2++ }
    }
    if (found != 0 && found2 == 0) { return true }
    return false
  },
  //= =======================================================================================================
  //= ============================== service to calculate line items total ==============================
  couponApplyOnProductService (value, coupon) {
    if (coupon.product_ids.length === 0 && coupon.exclude_product_ids.length === 0) { return true }
    const id = value.products_id
    let found = 0
    // checking in allowed products
    for (const value of coupon.product_ids) {
      if (id == value) {
        found++
        return true
      }
    }
    if (coupon.product_ids.length === 0) {
      found++
    }
    let found2 = 0
    // checking in excluded products
    for (const value of coupon.exclude_product_ids) {
      if (id == value) {
        found2++
        return true
      }
    }
    if (found != 0 && found2 == 0) {
      return true
    }
    return false
  },
  //= =======================================================================================================
  //= ============================== service to calculate line items total ==============================
  checkAlreadyAppliedService (coupon, couponLines) {
    if (couponLines.length === 0) return false
    let found = false
    for (const value of couponLines) {
      if (value.code == coupon.code) { found = true }
    }
    return found
  },
  //= =======================================================================================================
  //= ============================== service to calculate line items total ==============================
  checkUserUsageService (coupon) {
    if (coupon.used_by.length === 0) return false
    if (coupon.usage_limit == null && coupon.usage_limit_per_user == null) return false
    if (coupon.usage_limit == 0) { } else if (coupon.usage_count >= coupon.usage_limit) return true
    const id = SyncStorage.get('customerData').email
    if (SyncStorage.get('customerData') != null) { var id2 = SyncStorage.get('customerData').customers_id }
    let count = 0
    for (const value of coupon.used_by) {
      if (value == id || value == id2) count++
    }
    if (count >= coupon.usage_limit_per_user) { return true } else { return false }
  },
  //= =======================================================================================================
  //= ============================== service to check ==============================
  checkNoItemInCartService (lineItems, coupon) {
    const productIds = coupon.product_ids
    const ExProductIds = coupon.exclude_product_ids
    const pCategory = coupon.product_categories
    const ExPCategory = coupon.excluded_product_categories

    if (productIds.length === 0 && ExProductIds.length === 0 && pCategory.length === 0 && ExPCategory.length === 0) { return true }
    let result = false
    if (productIds.length !== 0) {
      for (const x of lineItems) { // upper loop
        const id = x.products_id; let vId = -1
        if (x.variation_id !== undefined) vId = x.variation_id
        for (const y of productIds) { // lower loop
          if (id == y || vId == y) { result = true }
        }
      }
    } else { result = true }
    // checking in excluded products ids
    if (ExProductIds.length != 0) {
      for (const x of lineItems) { // upper loop
        const id = x.products_id; let vId = -1
        if (x.variation_id != undefined) vId = x.variation_id
        for (const y of ExProductIds) { // lower loop
          if (id == y || vId == y) { result = false }
        }
      }
    }
    let result2 = false
    if (pCategory.length != 0) {
      for (const w of lineItems) { // upper loop
        for (const x of w.categories) { // midddle loop
          for (const y of pCategory) { // lower loop
            if (x.id == y) { result2 = true }
          }
        }
      }
    } else { result2 = true }
    if (ExPCategory.length != 0) {
      for (const w of lineItems) { // upper loop
        for (const x of w.categories) { // midddle loop
          for (const y of pCategory) { // lower loop
            if (x.id == y) { result2 = false }
          }
        }
      }
    }
    if (result == true && result2 == true && coupon.discount_type != 'fixed_cart') { return true } else if (result == true && result2 == true && coupon.discount_type != 'percent') { return true } else if (result == true && result2 == false && coupon.discount_type == 'fixed_product') { return true } else if (result == true && result2 == false && coupon.discount_type == 'percent_product') { return true } else if (result == false && result2 == true && coupon.discount_type == 'percent_product') { return true } else if (result == false && result2 == true && coupon.discount_type == 'fixed_product') { return true }
    return false
  },
  //= =======================================================================================================
  //= ============================== service to check coupon will apply on cart or not  ==============================

  //= =======================================================================================================
  //= ============================== service to check the validity of coupon  ==============================
  validateCouponService (toast, coupon, lineItems, couponLines) {
    const expDate = new Date(coupon.expiry_date)
    const todayDate = new Date()
    // checking coupon expire or not
    if (expDate <= todayDate && coupon.expiry_date != null) {
      // this.alert.show('Sorry Coupon is Expired');
      // alert('Sorry Coupon is Expired');
      toast.show('Sorry Coupon is Expired')
      return false
    }
    // if cart amount is lower than the coupon minimum limit
    else if (this.lineItemTotalService(lineItems) <= coupon.minimum_amount) {
      // alert('Sorry your Cart total is low than coupon min limit!');
      toast.show('Sorry your Cart total is low than coupon min limit!')
      // this.alert.show('Sorry your Cart total is low than coupon min limit!');
      return false
    }
    // if cart amount is higher than the coupon minimum limit
    else if (this.lineItemTotalService(lineItems) >= coupon.maximum_amount && coupon.maximum_amount != 0) {
      // alert('Sorry your Cart total is Higher than coupon Max limit!');
      toast.show('Sorry your Cart total is Higher than coupon Max limit!')
      // this.alert.show('Sorry your Cart total is Higher than coupon Max limit!');
      return false
    } else if (this.emailCheckService(coupon.email_restrictions) == true) {
      // alert('Sorry, this coupon is not valid for this email address!');
      toast.show('Sorry, this coupon is not valid for this email address!')
      //  this.alert.show('Sorry, this coupon is not valid for this email address!');
      return false
    }
    //= ============================================================= further checking
    else if (this.checkOnSaleService(lineItems, coupon) == true) {
      // alert('Sorry, this coupon is not valid for sale items.');
      toast.show('Sorry, this coupon is not valid for sale items.')
      // this.alert.show('Sorry, this coupon is not valid for sale items.');
      return false
    } else if (this.checkAlreadyAppliedService(coupon, couponLines) == true) {
      // alert('Coupon code already applied!');
      toast.show('Coupon code already applied!')
      // this.alert.show('Coupon code already applied!');
      return false
    } else if (couponLines != 0 && couponLines[0].individual_use == true) {
      // alert('Sorry Individual Use Coupon is already applied any other coupon cannot be applied with it !');
      toast.show('Sorry Individual Use Coupon is already applied any other coupon cannot be applied with it !')
      // this.alert.show('Sorry Individual Use Coupon is already applied any other coupon cannot be applied with it !');
      return false
    } else if (this.checkUserUsageService(coupon) == true) {
      //  alert('Coupon usage limit has been reached.');
      toast.show('Coupon usage limit has been reached.')
      // this.alert.show('Coupon usage limit has been reached.');
      return false
    }
    return true
  },
  //= =======================================================================================================
  //= ============================== service to apply check coupon ==============================

  apply (coupon, lineItems) {
    let productLimit = coupon.limit_usage_to_x_items
    if (productLimit == 0) productLimit = null
    let productqtyflag = 0
    if (coupon.discount_type == 'fixed_cart') {
      const cartTotal = parseFloat(this.lineItemTotalService(lineItems))
      const discount = parseFloat((coupon.amount / cartTotal).toString())
      lineItems.forEach((value, index) => {
        let result = value.total - parseFloat((discount * value.total).toString())
        if (result < 0) result = 0
        value.total = result
      })
      return lineItems
    } else if (coupon.discount_type == 'percent') {
      lineItems.forEach((value, index) => {
        const amount = parseFloat(coupon.amount)
        const subtotal = parseFloat(value.subtotal)
        const total = parseFloat(value.total)
        const discount = (subtotal / 100) * amount
        value.total = parseFloat((total - discount).toString())
        if (value.total < 0) value.total = 0
      })
      return lineItems
    } else if (coupon.discount_type == 'fixed_product') {
      const amount = parseFloat(coupon.amount)
      lineItems.forEach((value, index) => {
        if (this.couponApplyOnProductService(value, coupon) && this.checkCategoriesService(value, coupon)) {
          const quantity = value.customers_basket_quantity
          let total = parseFloat(value.total)
          if (productLimit > 0) {
            for (let l = 1; l <= quantity; l++) {
              if (productqtyflag < productLimit) {
                total = parseFloat((total - amount).toString())
                productqtyflag += 1
              }
            }
            value.total = total
          } else {
            value.total = parseFloat((total - (amount * quantity)).toString())
          }
          if (value.total < 0) { value.total = 0 }
        }
      })
      return lineItems
    } else if (coupon.discount_type == 'percent_product') {
      const amount = parseFloat(coupon.amount)
      lineItems.forEach((value, index) => {
        if (this.couponApplyOnProductService(value, coupon) && this.checkCategoriesService(value, coupon)) {
          let total = parseFloat(value.total)
          if (productLimit > 0) {
            for (let l = 1; l <= value.customers_basket_quantity; l++) {
              const discount = parseFloat(((value.price / 100) * amount).toString())
              if (productqtyflag < productLimit) {
                total = parseFloat((total - discount).toString())
                productqtyflag += 1
              }
            }
            value.total = total
          } else {
            value.total = parseFloat((total - (total / 100) * amount).toString())
          }

          if (value.total < 0) value.total = 0
        }
      })
      return lineItems
    }
  }
}
export default CouponProvider
