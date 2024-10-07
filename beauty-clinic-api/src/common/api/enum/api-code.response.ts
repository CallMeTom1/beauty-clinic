export enum ApiCodeResponse {

    // Token errors
    NO_TOKEN_FOUNDED = 'api.security.token.no_token_founded',
    TOKEN_EXPIRED = 'api.security.token.token_expired',
    TOKEN_GEN_ERROR = 'api.security.token.token_gen_error',
    TOKEN_REFRESH_ERROR = 'api.security.token.token_refresh_error',
    TOKEN_ISNOT_STRING_ERROR = 'api.security.token.is_not_string_error',

    // User authentication and authorization errors
    SIGNUP_ERROR = 'api.security.user.signup_error',
    SIGNIN_ERROR = 'api.security.user.signin_error',
    GOOGLE_AUTH_ERROR = 'api.security.user.google-auth-error',
    FACEBOOK_AUTH_ERROR = 'api.security.user.facebook-auth-error',
    SOCIAL_SIGN_ERROR = 'api.security.user.social-sign-error',
    USER_NOT_FOUND = 'api.security.user.user_not_found',
    USER_WRONG_PASSWORD = 'api.security.user.wrong_password',
    CREDENTIAL_NOT_FOUND = 'api.security.credential.not_found',
    CREDENTIAL_DELETE_ERROR = 'api.security.user.credential_delete_error',
    USER_ALREADY_EXIST = 'api.security.user.user_already_exist',
    USER_INSUFFICIENT_ROLE_EXCEPTION ='api.security.user.insufficient.role.exception',
    COMMON_SUCCESS = 'api.result.common-succes',

    // Payload validation errors
    PAYLOAD_IS_NOT_VALID = 'api.error.payload-is-not-valid',
    PAYLOAD_PARAM_IS_MISSING = 'api.error.payload-params-missing',

    // Signin payload validation errors
    SIGNIN_PAYLOAD_MAIL_IS_EMPTY= 'api.signin.payload.mail.is_empty',
    SIGNIN_PAYLOAD_MAIL_IS_NOT_VALID= 'api.signin.payload.mail.is_not_valid',
    SIGNIN_PAYLOAD_PASSWORD_IS_EMPTY= 'api.signin.payload.password.is_empty',
    SIGNIN_PAYLOAD_PASSWORD_IS_NOT_STRING= 'api.signin.payload.password.is_not_string',
    SIGNIN_PAYLOAD_GOOGLE_HASH_IS_NOT_STRING= 'api.signin.payload.google_hash.is_not_string',
    SIGNIN_PAYLOAD_FACEBOOK_HASH_IS_NOT_STRING= 'api.signin.payload.facebook_hash.is_not_string',
    SIGNIN_PAYLOAD_SOCIAL_LOGIN_IS_NOT_BOOLEAN= 'api.signin.payload.social_login.is_not_boolean',

    // Signup payload validation errors
    SIGNUP_PAYLOAD_USERNAME_IS_EMPTY= 'api.signup.payload.username.is_empty',
    SIGNUP_PAYLOAD_USERNAME_LENGTH_INVALID= 'api.signup.payload.username.length_invalid',
    SIGNUP_PAYLOAD_USERNAME_INVALID_CHARACTERS= 'api.signup.payload.username.invalid_characters',
    SIGNUP_PAYLOAD_PASSWORD_IS_EMPTY= 'api.signup.payload.password.is_empty',
    SIGNUP_PAYLOAD_PASSWORD_LENGTH_INVALID= 'api.signup.payload.password.length_invalid',
    SIGNUP_PAYLOAD_PASSWORD_INVALID_CHARACTERS= 'api.signup.payload.password.invalid_characters',
    SIGNUP_PAYLOAD_PHONE_NUMBER_LENGTH_INVALID= 'api.signup.payload.phone_number.length_invalid',
    SIGNUP_PAYLOAD_FIRSTNAME_LENGTH_INVALID= 'api.signup.payload.firstname.length_invalid',
    SIGNUP_PAYLOAD_FIRSTNAME_INVALID_CHARACTERS= 'api.signup.payload.firstname.invalid_characters',
    SIGNUP_PAYLOAD_LASTNAME_LENGTH_INVALID= 'api.signup.payload.lastname.length_invalid',
    SIGNUP_PAYLOAD_LASTNAME_INVALID_CHARACTERS= 'api.signup.payload.lastname.invalid_characters',
    SIGNUP_PAYLOAD_MAIL_IS_EMPTY= 'api.signup.payload.mail.is_empty',
    SIGNUP_PAYLOAD_MAIL_IS_NOT_VALID= 'api.signup.payload.mail.is_not_valid',
    SIGNUP_PAYLOAD_MAIL_INVALID_CHARACTERS= 'api.signup.payload.mail.invalid_characters',
    SIGNUP_PAYLOAD_GOOGLE_HASH_INVALID_CHARACTERS= 'api.signup.payload.google_hash.invalid_characters',
    SIGNUP_PAYLOAD_FACEBOOK_HASH_INVALID_CHARACTERS= 'api.signup.payload.facebook_hash.invalid_characters',

    // User management errors
    USER_CREATION_ERROR = 'api.user.user_creation_error',

    // File and document errors
    INVALID_FILE_TYPE_ERROR = 'api.file.invalid.type.error',
    DOCUMENT_UPLOAD_ERROR = 'api.document.upload.error',
    REJECT_DOCUMENT_UPLOAD_ERROR = 'api.document.upload.error',
    ACCEPT_DOCUMENT_UPLOAD_ERROR = 'api.document.accept.error',
    LIST_PENDING_DOCUMENT_ERROR = 'api.document.list.pending.error',
    DOCUMENT_NOT_FOUND_EXCEPTION = 'api.document.not_found.error',

    //Care
    CARE_NOT_FOUND = 'api.care.not.found',
    ADD_CARE_USER_N0T_ADMIN_ERROR = 'api.care.create.error.user-not-admin',
    MODIFY_CARE_USER_N0T_ADMIN_ERROR = 'api.care.modify.error.user-not-admin',
    DELETE_CARE_USER_N0T_ADMIN_ERROR = 'api.care.delete.error.user-not-admin',
    CARE_ALREADY_EXIST_EXCEPTION = 'api.care.create.error.already.exist',
    CARE_CREATE_ERROR = 'api.care.create.error',
    CARE_DELETE_ERROR = 'api.care.delete.error',
    CARE_MODIFY_ERROR = 'api.care.modify.error',
    CARE_GET_ERROR = 'api.care.gets_all.error',

    //Appointment
    APPOINTMENT_CREATE_ERROR = 'api.appointment.create.error',
    APPOINTMENT_STATUS_UPDATE_ERROR = 'api.appointment.update.status.error',
    APPOINTMENT_NOT_FOUND = 'api.appointment.not.found',
    APPOINTMENT_HOLIDAY_CONFLICT = 'api.appointment.holiday.conflict',
    APPOINTMENT_BUSINESS_HOURS_CONFLICT = 'api.appointment.business.hours.conflict',
    APPOINTMENT_CONFLICT = 'api.appointment.conflict',
    APPOINTMENT_DATE_INVALID = 'api.appointment.date.invalid',

    //Holiday
    HOLIDAY_CREATE_ERROR = 'api.holiday.create.error',
    HOLIDAY_UPDATE_ERROR = 'api.holiday.update.error',
    HOLIDAY_DELETE_ERROR = 'api.holiday.delete.error',
    HOLIDAY_NOT_FOUND = 'api.holiday.not.found',
    HOLIDAY_NOT_DATE_ERROR = 'api.holiday.not.date.error',
    HOLIDAY_ALREADY_EXIST_ERROR = 'api.holiday.already.exist.error',
    HOLIDAY_BAD_DATE_ERROR = 'api.holiday.bad.date.error',

    //Business Hours
    BUSINESSHOURS_CREATE_ERROR = 'api.business-hours.create.error',
    BUSINESSHOURS_UPDATE_ERROR = 'api.business-hours.update.error',
    BUSINESSHOURS_DELETE_ERROR = 'api.business-hours.delete.error',
    BUSINESSHOURS_NOT_FOUND = 'api.business-hours.not.found',
    BUSINESSHOURS_DAY_OF_WEEK_ERROR = 'api.business-hours.wrong_day_of_week',
    BUSINESSHOURS_INIT_ERROR = 'api.business-hours.init.error',
    BUSINESSHOURS_OPEN_ERROR = 'api.business-hours.open_error',
    BUSINESSHOURS_CLOSE_ERROR = 'api.business-hours.open_error',

    //Category-Product
    CATEGORY_PRODUCT_CREATE_ERROR = 'api.category-product.create.error',
    CATEGORY_PRODUCT_UPDATE_ERROR = 'api.category-product.update.error',
    CATEGORY_PRODUCT_UPDATE_ERROR_IMAGE = 'api.category-product.image.update.error',
    CATEGORY_PRODUCT_DELETE_ERROR = 'api.category-product.delete.error',
    CATEGORY_PRODUCT_NOT_FOUND = 'api.category-product.not.found',
    CATEGORY_PRODUCT_PUBLISH_ERROR = 'api.category-product.publish.error',
    CATEGORY_PRODUCT_UNPUBLISH_ERROR = 'api.category-product.unpublish.error',

    //Product
    PRODUCT_CREATE_ERROR = 'api.product.create.error',
    PRODUCT_UPDATE_ERROR = 'api.product.update.error',
    PRODUCT_UPDATE_ERROR_IMAGE = 'api.product.image.update.error',
    PRODUCT_DELETE_ERROR = 'api.product.delete.error',
    PRODUCT_NOT_FOUND = 'api.product.not.found',
    PRODUCT_PUBLISH_ERROR = 'api.product.publish.error',
    PRODUCT_UNPUBLISH_ERROR = 'api.product.unpublish.error',
    PRODUCT_ADD_CATEGORY_ERROR = 'api.product.add-category.error'

}