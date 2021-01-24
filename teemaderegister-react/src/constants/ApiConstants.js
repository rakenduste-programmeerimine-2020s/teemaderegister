const API = '/api'

export const AUTH_LOCAL_LOGIN_URL = `${API}/auth/local/login`
export const AUTH_LOGOUT_URL = `${API}/auth/logout`
export const CURRICULUMS_URL = `${API}/curriculums`
export const CURRICULUM_SLUG_URL = `${API}/curriculums/:slug`
export const TOPICS_ADMIN_URL = `${API}/admin/topics`
export const PASSWORD_FORGOT_URL = `${API}/auth/forgot`
export const PASSWORD_RESET_URL = `${API}/auth/reset/:token`
export const SEARCH_COUNTS_URL = `${API}/search/counts`
export const SUPERVISOR_CURRICULUMFORM_URL = `${API}/supervisors/curriculumForm`
export const SUPERVISOR_SLUG_URL = `${API}/supervisors/:slug`
export const SUPERVISORS_URL = `${API}/supervisors`
export const TOPICS_URL = `${API}/topics`
//export const TOPICS_ADD_URL = `${API}/topics/add`
export const USER_ME_URL = `${API}/users/me`
export const USER_PROFILE_URL = `${API}/users/profile`
export const USER_UPDATE_PROFILE_URL = `${API}/users/profile`
export const USER_UPDATE_PASSWORD_URL = `${API}/users/password`
export const USER_PICTURE_UPLOAD_URL = `${API}/users/upload-picture`
export const USER_PICTURE_RESET_URL = `${API}/users/reset-picture`
export const CSV_REQUEST = `${API}/csv`
export const ADMIN_VIEW_USERS_URL = `${API}/admin/users`
export const ADMIN_ADD_NEW_USER = `${API}/admin/createUser`
export const TOS_LOAD = `${API}/tos`
export const TOS_SAVE = `${API}/admin/tos/save`

export const ADMIN_GET_CURRICULUMS = `${API}/admin/curriculums`
export const ADMIN_GET_USERS = `${API}/admin/user/ids`

export const USER_FACTOR = `${API}/auth/local/factor`
export const USER_FACTOR_ENABLE = `${API}/auth/local/factor/enable`
export const USER_FACTOR_DISABLE = `${API}/auth/local/factor/disable`
export const USER_FACTOR_INSERT = `${API}/auth/local/factor/insert`

export const SIGNUP_URL = `${API}/auth/local/signup`
export const USER_CONFIRM_EMAIL_URL = `${API}/auth/emailconfirm`
