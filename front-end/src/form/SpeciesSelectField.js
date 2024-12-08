import {useField} from 'react-final-form';
import PaginatedAsyncSelect from '../components/PaginatedAsyncSelect';
import {birdsApi} from "../api/birdsApi";


const SpeciesSelectField = ({isMulti, isMandatory, isDisabled}) => {
    const {input} = useField('species');

    const promiseHotels = async (search, _options, additional) => {
        const page = additional?.page ?? 0;

        return await birdsApi.getSpecies(page, search).then(
            result =>
                ({
                    options: result.data.content.map(species => ({
                        label: `${species.species}`,
                        value: species.species,
                    })),
                    additional: {
                        page: page + 1,
                    },
                })
        );
    };

    const handleChange = (options) => {
        input.onChange(options?.value);
    };
    const customStyles = {
        menu: (provided) => ({...provided, zIndex: 9999})
    };
    return (
        <PaginatedAsyncSelect
            name="hotels"
            label="Specie"
            placeholder={isMulti ? 'Specie' : 'Specie'}
            isMandatory={isMandatory}
            onLoadOptions={promiseHotels}
            onChange={handleChange}
            isDisabled={isDisabled}
            isMulti={isMulti}
            isClearable
            validate={undefined}
            style={customStyles}
        />
    );
};

export default SpeciesSelectField;
