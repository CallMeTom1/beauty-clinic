export enum ApiURI {
  SECURITY_SIGN_IN='account/signin',
  SECURITY_SIGN_UP='account/signup',
  ME='account/me',
  REFRESH_TOKEN = 'account/refresh',
  SIGN_GOOGLE_URL= 'https://localhost:2023/api/account/google/login',
  UPLOAD_PROFILE_IMAGE= 'users/upload-profile-image',
  USER = 'users',
  VERIFY_EMAIL = 'account/verify-email',
  SIGN_OUT = 'account/signout',

  CARE='care',
  ADD_CARE='care',
  BUSINESS_HOURS='business-hours',
  HOLIDAY = 'holiday',
  HOLIDAY_INTERVAL = 'holiday/interval',
  APPOINTMENT = 'appointment',
  APPOINTMENT_CREATE_ADMIN = 'appointment/admin-create-appointment',
  APPOINTMENT_CONFIRM = 'appointment/confirm',
  APPOINTMENT_CANCEL = 'appointment/cancel',
  APPOINTMENT_AVAILABLE_DAYS = 'appointment/available-days',
  APPOINTMENT_AVAILABLE_SLOTS = 'appointment/available-slots',
  APPOINTMENT_UPDATE_NOTE = 'appointment/update-note',

  CHANGE_PASSWORD = 'account/change-password',
  RESET_PASSWORD = 'account/reset-password',
  FORGOT_PASSWORD = 'account/forgot-password',

  //PRODUCTS
  PRODUCTS = 'products',
  PRODUCT_PUBLISH = 'products/publish',
  PRODUCT_UNPUBLISH = 'products/unpublish',
  PRODUCT_PUBLISHED = 'products/published',
  PRODUCT_ADD_CATEGORY = 'products/add-category',
  PRODUCT_UPLOAD_IMAGE = 'products/upload-product-image',
  UPDATE_PRODUCT_CATEGORIES = 'products/update-categories',


  //PRODUCT CATEGORIES
  PRODUCT_CATEGORIES = 'product-categories',
  PRODUCT_CATEGORIES_PUBLISH = 'product-categories/publish',
  PRODUCT_CATEGORIES_UNPUBLISH = 'product-categories/unpublish',
  PRODUCT_CATEGORIES_PUBLISHED = 'product-categories/published',
  PRODUCT_CATEGORIES_UPLOAD_IMAGE = 'product-categories/upload-category-product-image',
  //CART

  CART = 'cart',
  CART_UPDATE_QUANTITY = 'cart/update',

  //ORDERS
  ORDERS = 'orders',

  //PAYMENTS
  PAYMENTS = 'payments',

}
