import React, {useState} from 'react'
import {Form} from 'react-final-form'
import {Button} from '../button/Button'
import SpeciesSelectField from "../form/SpeciesSelectField";
import {TextField} from "../form/TextFiled";
import {RadioButton} from "../form/RadioButton";
import {DatePickerField} from "../form/DatePickerField";

export default function BirdFilter({onSubmit, onReset}) {
    const [keyState, setKeyState] = useState(false)

    const toggleKeyState = (form) => {
        onReset()
        form.reset()
        form.submit()
        setKeyState(prevState => !prevState)
    }

    return (
        <Form onSubmit={onSubmit}
              render={({handleSubmit, submitting, values, form}) => {
                  return (
                      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mx-2 bg-white p-2 rounded-md">
                          <div className='flex flex-col space-y-2'>

                              <div className='flex flex-col mx-2'>
                                  <SpeciesSelectField key={keyState}/>
                              </div>

                              <TextField name={'observations'} label={'Observații'} type={'number'} className='mx-2'
                                         min="0"/>

                              <div className='flex flex-col mx-2'>
                                  <label className='block text-sm font-bold mt-2'>An </label>
                                  <div className='flex flex-col space-y'>
                                      <RadioButton label={'An'} name={'periodType'} value={'YEAR'}/>
                                      <RadioButton label={'Comparație ani'} name={'periodType'} value={'PERIOD'}/>
                                  </div>
                              </div>

                              {values.periodType === 'PERIOD' &&
                                  <div className='flex flex-col space-y mx-2'>
                                      <DatePickerField
                                          label={'An'}
                                          name="year"
                                      />
                                      <DatePickerField
                                          label={'An Comparație'}
                                          name="comparisonYear"
                                      />
                                  </div>}

                              {values.periodType === 'YEAR' &&
                                  <div className='mx-2'>
                                      <DatePickerField
                                          label={'An'}
                                          name="year"
                                      />
                                  </div>}

                              <div className="flex justify-center space-x-4">
                                  <Button type="submit" disabled={submitting} textButton={false}>
                                      {'Aplică Filtrele'}
                                  </Button>
                                  <Button type="reset" textButton onClick={() => toggleKeyState(form)}>
                                      {'Șterge Filtrele'}
                                  </Button>
                              </div>
                          </div>
                      </form>
                  );
              }}
        />)
}
