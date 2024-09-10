export enum ApiURI {
  SECURITY_SIGN_IN='account/signin',
  SECURITY_SIGN_UP='account/signup',
  ME='account/me',
  REFRESH_TOKEN = 'account/refresh',
  SIGN_GOOGLE_URL= 'https://localhost:2023/api/account/google/login',
  UPLOAD_PROFILE_IMAGE= 'users/upload-profile-image',
  USER = 'users',

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
  APPOINTMENT_UPDATE_NOTE = 'appointment/update-note'


}
