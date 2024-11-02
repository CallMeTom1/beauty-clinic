import {ApiCodeResponse} from "@common/api";
import {ApiException} from "@common/api/api.exception";


export class NoTokenFoundedException extends ApiException {
    constructor() {
        super(ApiCodeResponse.NO_TOKEN_FOUNDED, 401);
    }
}

export class TokenIsNotStringException extends ApiException {
    constructor() {
        super(ApiCodeResponse.TOKEN_ISNOT_STRING_ERROR, 401);
    }
}

export class UserNotFoundException extends ApiException {
    constructor() {
        super(ApiCodeResponse.USER_NOT_FOUND, 200);
    }
}

export class WrongPasswordException extends ApiException {
    constructor() {
        super(ApiCodeResponse.USER_WRONG_PASSWORD, 200);
    }
}

export class CredentialNotFoundException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CREDENTIAL_NOT_FOUND, 200);
    }
}

export class UserInsucfficientRoleException extends ApiException {
    constructor() {
        super(ApiCodeResponse.USER_INSUFFICIENT_ROLE_EXCEPTION, 200);
    }
}

export class TokenExpiredException extends ApiException {
    constructor() {
        super(ApiCodeResponse.TOKEN_EXPIRED, 401);
    }
}

export class SignupException extends ApiException {
    constructor() {
        super(ApiCodeResponse.SIGNUP_ERROR, 200);
    }
}

export class SigninException extends ApiException {
    constructor() {
        super(ApiCodeResponse.SIGNIN_ERROR, 200);
    }
}

export class CredentialDeleteException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CREDENTIAL_DELETE_ERROR, 200);
    }
}

export class UserAlreadyExistException extends ApiException {
    constructor() {
        super(ApiCodeResponse.USER_ALREADY_EXIST, 200);
    }
}

export class TokenRevokedException extends  ApiException {
    constructor() {
        super(ApiCodeResponse.TOKEN_REVOKE_ERROR, 500);
    }
}

export class TokenGenerationException extends ApiException {
    constructor() {
        super(ApiCodeResponse.TOKEN_GEN_ERROR, 500);
    }
}

export class TokenNotFoundException extends ApiException {
    constructor() {
        super(ApiCodeResponse.TOKEN_NOT_FOUND, 500);
    }
}

export class GoogleAuthException extends ApiException {
    constructor() {
        super(ApiCodeResponse.GOOGLE_AUTH_ERROR, 200);
    }
}

export class FacebookAuthException extends ApiException {
    constructor() {
        super(ApiCodeResponse.FACEBOOK_AUTH_ERROR, 200);
    }
}

export class SocialSignException extends ApiException {
    constructor() {
        super(ApiCodeResponse.SOCIAL_SIGN_ERROR, 200);
    }
}

export class InvalidFileTypeException extends ApiException {
    constructor() {
        super(ApiCodeResponse.INVALID_FILE_TYPE_ERROR, 200);
    }
}

export class AddOrUpdateFileException extends ApiException {
    constructor() {
        super(ApiCodeResponse.DOCUMENT_UPLOAD_ERROR, 200);
    }
}

export class ListPendingDocumentException extends ApiException {
    constructor() {
        super(ApiCodeResponse.LIST_PENDING_DOCUMENT_ERROR, 200);
    }
}

export class DocumentNotFoundException extends ApiException {
    constructor() {
        super(ApiCodeResponse.DOCUMENT_NOT_FOUND_EXCEPTION, 200);
    }
}

export class FileUploadException extends ApiException {
    constructor() {
        super(ApiCodeResponse.DOCUMENT_UPLOAD_ERROR, 200);
    }
}

export class RejectFileUploadException extends ApiException {
    constructor() {
        super(ApiCodeResponse.REJECT_DOCUMENT_UPLOAD_ERROR, 200);
    }
}

export class AcceptFileUploadException extends ApiException {
    constructor() {
        super(ApiCodeResponse.ACCEPT_DOCUMENT_UPLOAD_ERROR, 200);
    }
}