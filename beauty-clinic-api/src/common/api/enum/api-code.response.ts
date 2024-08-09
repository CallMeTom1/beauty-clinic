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

    // Wallet errors
    WALLET_NOT_FOUND = 'api.wallet.wallet_not_found',
    WALLET_CREATION_ERROR = 'api.wallet.wallet_creation_error',
    WALLET_DUPLICATE_ERROR = 'api.wallet.wallet_duplicate_error',
    WALLET_ASSET_ERROR = 'api.wallet.wallet_asset_not_found_error',
    WALLET_INSUFFICIENT_FUND_ERROR = 'api.wallet.wallet_insufficient_fund_error',
    WALLET_TRANSFERT_USDT_SPOT_TO_MARGIN_ERROR = 'api.wallet.error.transfer.usdt.spot_to_margin',

    // Asset errors
    ASSET_NOT_FOUND= 'api.asset.asset_not_found',
    ASSET_CREATION_ERROR= 'api.asset.asset_creation_error',
    FETCHING_PRICES_ERROR= 'api.asset.fetching.price.error',
    SWAP_CALCULATE_FEES_ERROR = 'api.asset.swap.calculate.fees.error',

    // Add USDT payload validation errors
    ADD_USDT_PAYLOAD_AMOUNT_IS_NOT_NUMBER= 'api.asset.payload.add.usdt.amount.isnot.number',
    ADD_USDT_PAYLOAD_AMOUNT_IS_EMPTY= 'api.asset.payload.add.usdt.amount.is.empty',
    ADD_USDT_PAYLOAD_AMOUNT_IS_LESS_THAN_MINIMUM_VALUE= 'api.asset.payload.add.usdt.amount.is.lessThan0',
    ADD_USDT_PAYLOAD_AMOUNT_IS_TOO_HIGH='api.asset.payload.add.usdt.amount.is.biggerThan1000000',

    // SwapAsset payload validation errors
    CONVERT_ASSET_PAYLOAD_SYMBOLA_IS_NOT_ENUM= 'api.asset.payload.convert.symbolA.isnot.enum',
    CONVERT_ASSET_PAYLOAD_SYMBOLA_IS_EMPTY= 'api.asset.payload.convert.symbolA.is.empty',
    CONVERT_ASSET_PAYLOAD_SYMBOLB_IS_NOT_ENUM= 'api.asset.payload.convert.symbolB.isnot.enum',
    CONVERT_ASSET_PAYLOAD_SYMBOLB_IS_EMPTY= 'api.asset.payload.convert.symbolB.is.empty',
    CONVERT_ASSET_PAYLOAD_QUANTITY_IS_NOT_NUMBER= 'api.asset.payload.convert.quantity.isnot.number',
    CONVERT_ASSET_PAYLOAD_QUANTITY_IS_EMPTY= 'api.asset.payload.convert.quantity.is.empty',
    CONVERT_ASSET_PAYLOAD_SIDE_IS_NOT_ENUM= 'api.asset.payload.convert.side.isnot.enum',
    CONVERT_ASSET_PAYLOAD_SIDE_IS_EMPTY= 'api.asset.payload.convert.side.is.empty',
    CONVERT_ASSET_PAYLOAD_IS_NOT_POSITIVE='api.asset.payload.convert.side.is.not.positive',

    // CreateAsset payload validation errors
    CREATE_ASSET_PAYLOAD_SYMBOL_IS_NOT_ENUM= 'api.asset.payload.create.symbol.isnot.enum',
    CREATE_ASSET_PAYLOAD_SYMBOL_IS_EMPTY= 'api.asset.payload.create.symbol.is.empty',
    CREATE_ASSET_PAYLOAD_AMOUNT_IS_NOT_NUMBER= 'api.asset.payload.create.amount.isnot.number',
    CREATE_ASSET_PAYLOAD_AMOUNT_IS_EMPTY= 'api.asset.payload.create.amount.is.empty',
    CREATE_ASSET_PAYLOAD_AMOUNT_IS_NOT_POSITIVE= 'api.asset.payload.create.amount.isnot.positive',
    CREATE_ASSET_PAYLOAD_WALLET_ID_IS_EMPTY= 'api.asset.payload.create.walletId.is.empty',
    CREATE_ASSET_PAYLOAD_WALLET_ID_IS_NOT_STRING= 'api.asset.payload.create.walletId.isnot.string',

    // Symbol errors
    SYMBOL_NOT_FOUND_ERROR = 'api.symbol.not.found.error',

    // User management errors
    USER_CREATION_ERROR = 'api.user.user_creation_error',

    // Transaction errors
    TRANSACTION_NOT_FOUND = 'api.transaction.transaction_not_found',

    // File and document errors
    INVALID_FILE_TYPE_ERROR = 'api.file.invalid.type.error',
    DOCUMENT_UPLOAD_ERROR = 'api.document.upload.error',
    REJECT_DOCUMENT_UPLOAD_ERROR = 'api.document.upload.error',
    ACCEPT_DOCUMENT_UPLOAD_ERROR = 'api.document.accept.error',
    LIST_PENDING_DOCUMENT_ERROR = 'api.document.list.pending.error',
    DOCUMENT_NOT_FOUND_EXCEPTION = 'api.document.not_found.error',

    // Message errors
    MESSAGE_DELETE_USER_NOT_MODO_ERROR = 'api.error.message.user.not.modo',
    MESSAGE_NOT_FOUND_ERROR = 'api.error.message.not.found',
    MESSAGE_DELETE_NOT_AUTHORIZE = 'api.error.message.user.not.authorize',

    // CreateMessage payload validation errors
    MESSAGE_PAYLOAD_CONTENT_IS_EMPTY = 'api.message.payload.content.is_empty',
    MESSAGE_PAYLOAD_CONTENT_IS_NOT_STRING = 'api.message.payload.content.is_not_string',
    MESSAGE_PAYLOAD_CONTENT_LENGTH_INVALID = 'api.message.payload.content.length_invalid',

    // CreateTopic payload validation errors
    TOPIC_PAYLOAD_TITLE_IS_EMPTY = 'api.topic.payload.title.is_empty',
    TOPIC_PAYLOAD_TITLE_IS_NOT_STRING = 'api.topic.payload.title.is_not_string',
    TOPIC_PAYLOAD_TITLE_LENGTH_INVALID = 'api.topic.payload.title.length_invalid',
    TOPIC_PAYLOAD_DESCRIPTION_IS_EMPTY = 'api.topic.payload.description.is_empty',
    TOPIC_PAYLOAD_DESCRIPTION_IS_NOT_STRING = 'api.topic.payload.description.is_not_string',
    TOPIC_PAYLOAD_DESCRIPTION_LENGTH_INVALID = 'api.topic.payload.description.length_invalid',

    // Message param validation errors
    MESSAGE_PAYLOAD_MESSAGE_ID_IS_EMPTY = 'api.message.payload.messageId.is_empty',

    // Topic errors
    TOPIC_DELETE_USER_NOT_MODO_ERROR = 'api.error.topic.user.not.modo',
    TOPIC_NOT_FOUND_ERROR = 'api.error.topic.not.found',
    TOPIC_NOT_AUTHORIZE_DELETE_ERROR = 'api.error.topic.delete.not.authorize',

    // Topic param validation errors
    DELETE_TOPIC_PAYLOAD_TOPIC_ID_IS_EMPTY = 'api.topic.payload.topicId.is_empty',
    DELETE_TOPIC_PAYLOAD_TOPIC_ID_IS_NOT_STRING = 'api.topic.payload.topicId.is_not_string',

    // Position errors
    POSITION_INISUFICIENT_MARGIN_AVAILABLE = 'api.position.insufficient.margin.available',
    POSITION_EXECUTE_TRADE_EXCEPTION = 'api.position.execute.trade.error',
    POSITION_OPEN_POSITION_ERROR = 'api.position.open.error',
    POSITION_UPDATE_EXCEPTION = 'api.position.update.error',
    POSITION_CLOSE_TRADE_EXCEPTION = 'api.position.closing.error',
    POSITION_NOT_FOUND_ERROR = 'api.position.closing.error',

    // Close Position payload validation errors
    CLOSE_POSITION_PAYLOAD_POSITION_ID_IS_NOT_STRING = 'api.position.payload.close.positionId.is_not_string',
    CLOSE_POSITION_PAYLOAD_POSITION_ID_LENGTH_INVALID = 'api.position.payload.close.positionId.length_invalid',
    CLOSE_POSITION_PAYLOAD_POSITION_ID_IS_EMPTY = 'api.position.payload.close.positionId.is_empty',

    // Execute Trade payload validation errors
    EXECUTE_TRADE_PAYLOAD_SYMBOL_IS_NOT_ENUM = 'api.trade.payload.execute.symbol.is_not_enum',
    EXECUTE_TRADE_PAYLOAD_SYMBOL_IS_EMPTY = 'api.trade.payload.execute.symbol.is_empty',
    EXECUTE_TRADE_PAYLOAD_QUANTITY_IS_NOT_NUMBER = 'api.trade.payload.execute.quantity.is_not_number',
    EXECUTE_TRADE_PAYLOAD_QUANTITY_IS_EMPTY = 'api.trade.payload.execute.quantity.is_empty',
    EXECUTE_TRADE_PAYLOAD_SIDE_IS_NOT_ENUM = 'api.trade.payload.execute.side.is_not_enum',
    EXECUTE_TRADE_PAYLOAD_SIDE_IS_EMPTY = 'api.trade.payload.execute.side.is_empty',
    EXECUTE_TRADE_PAYLOAD_LEVERAGE_IS_NOT_NUMBER = 'api.trade.payload.execute.leverage.is_not_number',
    EXECUTE_TRADE_PAYLOAD_LEVERAGE_IS_EMPTY = 'api.trade.payload.execute.leverage.is_empty',

    // Create Wallet payload validation errors
    CREATE_WALLET_PAYLOAD_TYPE_IS_NOT_ENUM = 'api.wallet.payload.create.type.is_not_enum',
    CREATE_WALLET_PAYLOAD_TYPE_IS_EMPTY = 'api.wallet.payload.create.type.is_empty',
    CREATE_WALLET_PAYLOAD_USER_ID_IS_EMPTY = 'api.wallet.payload.create.user_id.is_empty',
    CREATE_WALLET_PAYLOAD_USER_ID_IS_NOT_STRING = 'api.wallet.payload.create.user_id.is_not_string',

    // Get Futures Wallet payload validation errors
    GET_FUTURES_WALLET_PAYLOAD_USER_ID_IS_EMPTY = 'api.wallet.payload.get_futures.user_id.is_empty',
    GET_FUTURES_WALLET_PAYLOAD_USER_ID_IS_NOT_STRING = 'api.wallet.payload.get_futures.user_id.is_not_string',

    // Transfer USDT payload validation errors
    TRANSFER_USDT_PAYLOAD_AMOUNT_IS_EMPTY = 'api.wallet.payload.transfer_usdt.amount.is_empty',
    TRANSFER_USDT_PAYLOAD_AMOUNT_IS_NOT_NUMBER = 'api.wallet.payload.transfer_usdt.amount.is_not_number',
    TRANSFER_USDT_PAYLOAD_AMOUNT_IS_NOT_POSITIVE = 'api.wallet.payload.transfer_usdt.amount.is_not_positive',

    // Subscription errors
    INVALID_SUBSCRIPTION_TIER_ERROR = 'api.subscription.invalid.tier.error',
    SUBSCRIPTION_USER_NOT_VERIFY = 'api.subscription.user.not.verified',
    SUBSCRIPTION_NOT_FOUND_ERROR = 'api.subscription.not_found',
    SUBSCRIPTION_INVALID_SUBSCRIPTION_UPGRADE = 'api.subscription.error.invalid.upgrade.',

    // Add Subscription payload validation errors
    ADD_SUBSCRIPTION_PAYLOAD_TIER_IS_EMPTY = 'api.subscription.payload.tier.is_empty',
    ADD_SUBSCRIPTION_PAYLOAD_TIER_IS_NOT_ENUM = 'api.subscription.payload.tier.is_not_enum',


    //Care
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

}