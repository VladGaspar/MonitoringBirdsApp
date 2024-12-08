export const regex = {
    lettersOnly: '^[A-Za-z.]+$',
    email: '^([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,})?$',
    password: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]*$',
    minLength: '.{8,}$',
    uppercaseLetter: '^(?=.*?[A-Z])',
    lowercaseLetter: '^(?=.*?[a-z])',
    number: '^(?=.*?[0-9])',
    specialCharacter: '^(?=.*?[@$!%*?&])[A-Za-z\\d@$!%*?&]*$',
    noWhitespace: '^\\S*$',
    roomNumber: '^\\d{1,4}([a-zA-Z]?)$'
};
