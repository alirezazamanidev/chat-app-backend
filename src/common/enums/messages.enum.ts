

export enum AuthMessage {
    NotExpiredOtp = 'کد تایید هنوز منقضی نشده است!',
    NotFoundAccount = 'اکانت کاربر یافت نشد',
    OtpCodeIsIncorrect = 'کد تایید ارسال شده صحیح نمی باشد',
    LoginIsRequired = 'وارد حساب کاربری خود شوید',
    ExpiredCode = 'کد تایید منقصی شده مجددا تلاش کنید.',
    TryAgain = 'دوباره تلاش کنید',
    EmailOrPasswordIncurrent = 'ایمیل یا پسورد وارد شده نادرست است!',
    LoginAgain = 'مجددا وارد حساب کاربری خود شوید',
    
}
export enum PublicMessage {
    SendOtp='کد تایید با موفقیت ارسال شد!',
  LoggedIn = 'با موفقیت وارد حساب کاربری خود شدید',

}