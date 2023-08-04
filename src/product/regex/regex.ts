export function isEmail(email : String) {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== '' && email.match(emailFormat)) { return true; }
    
    return false;
}

export function isPassword(password : String) {
    if (password.length > 8 && typeof(password) === 'string') { return true; }
    
    return false;
}

export function isUsername(username : String) {
    if (username.length > 0 && typeof(username) === 'string') { return true; }
    
    return false;
}