import {FaXmark} from 'react-icons/fa6';
import {ImCheckmark} from 'react-icons/im';
import {Tooltip} from 'react-tooltip';
import {regex} from "../constants/regex";


const passwordRequirements = [
    {regex: regex.minLength, textId: 'Minim 8 caractere'},
    {regex: regex.lowercaseLetter, textId: 'O majusculă'},
    {regex: regex.uppercaseLetter, textId: 'O minusculă'},
    {regex: regex.specialCharacter, textId: 'Un număr'},
    {regex: regex.number, textId: 'Un caracter special (@,$,!,%,*,?,&)'},
    {regex: regex.noWhitespace, textId: 'Fără spații'},
];

export const PasswordTooltip = ({anchorSelect, value}) => {


    const validateRequirement = (regex, password) => {
        if (password === undefined) {
            return '• ';
        }
        const passRequirement = new RegExp(regex).test(password);
        return passRequirement ? <ImCheckmark className="text-primary"/> : <FaXmark className="text-error text-xl"/>;
    };

    return (
        <Tooltip anchorSelect={anchorSelect} place={'left'} className="z-50">
            <ul className="flex flex-col text-lg">
                {passwordRequirements.map((requirement, index) => (
                    <ol key={`${requirement.textId}${index}`} className="flex flex-row">
                        {validateRequirement(requirement.regex, value)} {requirement.textId}
                    </ol>
                ))}
            </ul>
        </Tooltip>
    );
};
