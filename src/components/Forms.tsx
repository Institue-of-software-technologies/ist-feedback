'use client';

import React, { forwardRef, useEffect, useState } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Path, useForm, FieldValues, PathValue } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface Input {
  label: string;
  type: string;
  value?: string;
  name?: string;
  defultSelect?: number[];
  options?: { label: string; value: number | string }[];
}

interface FormProps<T extends FieldValues> {
  Input: Input[];
  buttonColor?: string;
  buttonText?: string;
  hoverColor?: string;
  onSubmit: (data: T) => void;
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}
const Form = <T extends FieldValues>({ Input, onSubmit,buttonColor,buttonText,hoverColor }: FormProps<T>): JSX.Element => {
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
  const defaultColor = "bg-blue-500";
  const defaultHoverColor = "hover:bg-blue-600";
  const befaultText = "Submit";
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
                  {input.value ? ` 
  ${input.value}` : `select  
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
            ) : input.type === "time" ? (
              <>
                <div className="mb-4">

                  {/* <label htmlFor={input.label} className="block mb-2 text-sm font-medium text-gray-900 mt-2">{input.label}</label> */}
                  <div className="relative">
                    <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <input type="time" id={input.label} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" min="09:00" max="18:00" defaultValue={input.value} required {...register(`${input.label}` as Path<T>, { required: `${input.label} is required` })} />
                  </div>

                </div>
              </>
            ) : (
              <input
                id={input.label}
                type={input.type}
                defaultValue={input.value}
                {...register(input.label as Path<T>, { required: `${input.label} is required` })}
                className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            )}
          </div>
        )
      ))}

      <button
        type="submit"
        className={`${buttonColor || defaultColor} text-white px-4 py-2 rounded ${hoverColor||defaultHoverColor}`}
      >
        {buttonText||befaultText}  {/* Use default label "Submit" if none is provided */}
      </button>
    </form>
  );
};

export default Form;
