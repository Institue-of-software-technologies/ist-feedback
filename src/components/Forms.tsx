'use client';

import React, { forwardRef, useEffect, useState } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Path, useForm, FieldValues, PathValue } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Input {
  label: string;
  type: string;
  value?: string | number;
  defultSelect?: number[];
  options?: { label: string; value: number }[];
}

interface FormProps<T extends FieldValues> {
  Input: Input[];
  onSubmit: (data: T) => void;
}
interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}
const Form = <T extends FieldValues>({ Input, onSubmit }: FormProps<T>): JSX.Element => {

  const { register, handleSubmit, setValue } = useForm<T>();
  
  // State to track the selected options in the multi-select Listbox
  const [SelectedValue, setSelectedValue] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({ value, onClick }, ref) => (
      <div className="relative w-full">
        <input
          onClick={onClick}
          value={value || ""}
          ref={ref}
          readOnly
          className="w-full p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Select date and time"
        />
      </div>
    )
  );

  CustomInput.displayName = "CustomInput";


  useEffect(() => {
    // Set default values for the multi-select if provided
    Input.forEach((input) => {
      if (input.type === "multiple" && input.defultSelect) {
        setSelectedValue(input.defultSelect);
        setValue(
          input.label as Path<T>,
          input.defultSelect as unknown as PathValue<T, Path<T>>
        );
      }
    });
  }, [Input, setValue]);

  const handleMultiSelectChange = (selected: number[]) => {
    setSelectedValue(selected);
    setValue(
      'multiSelectField' as Path<T>,
      selected as unknown as PathValue<T, Path<T>>
    ); // Register the selected values in the form
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setValue("tokenExpiration" as Path<T>, date as unknown as PathValue<T, Path<T>>);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Input.map((input) => (
        input && (
          <div key={input.label} className="mb-4">
            <label htmlFor={input.label} className="block text-sm font-medium text-gray-700">
              {input.label}
            </label>

            {input.type === "select" ? (
               <select
               id={input.label}
               defaultValue={input.value} 
               {...register(input.label as Path<T>, { required: `${input.label} is required` })}
               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             >
               <option value=""> 
               {input.value?` 
  ${input.value}`:`select  
  ${input.label}`}</option>
               {input.options?.map((option) => (
                 <option key={option.value} value={option.value}>
                   {option.label}
                 </option>
               ))}
             </select> 
            ) : input.type === "multiple" ? (
              <Listbox value={SelectedValue} onChange={handleMultiSelectChange} multiple>
                <ListboxButton className="block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                  {SelectedValue.length > 0
                    ? SelectedValue.map((value) => input.options?.find(opt => opt.value === value)?.label).join(", ")
                    : "Select multiple options..."}
                </ListboxButton>
                <ListboxOptions className="mt-2 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {input.options?.map((option) => (
                    <ListboxOption key={option.value} value={option.value} className="cursor-pointer select-none p-2">
                      {({ selected }) => (
                        <>
                          <span className={selected ? "font-semibold" : "font-normal"}>
                            {option.label}
                          </span>
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            ) : input.type === "date" ? (
              <DatePicker
                selected={
                  selectedDate || new Date(input.value ? input.value.replace(' ', 'T') : new Date())
                } 
                onChange={(date) => handleDateChange(date)} 
                customInput={<CustomInput />}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full"
              />
            ) : (
              <input
                id={input.label}
                type={input.type}
                defaultValue={input.value}
                {...register(input.label as Path<T>, { required: `${input.label} is required` })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            )}
          </div>
        )
      ))}

      <button
        type='submit'
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
      >
        Submit
      </button>
    </form>
  );
};


export default Form;
