'use client';

import React, { forwardRef, useEffect, useState } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Path, useForm, FieldValues, PathValue } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface Input {
  label: string;
  type: string;
  require?: boolean;
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
  loading?: boolean;
  onSubmit: (data: T) => void;
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}
const Form = <T extends FieldValues>({ Input, onSubmit, buttonColor, buttonText, hoverColor, loading }: FormProps<T>): JSX.Element => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<T>();

  const [SelectedValue, setSelectedValue] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPasswordState, setShowPasswordState] = useState<{ [key: string]: boolean }>({});

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
    );
  };
  const defaultColor = "bg-blue-500";
  const defaultHoverColor = "hover:bg-blue-600";
  const befaultText = "Submit";
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setValue("tokenExpiration" as Path<T>, date as unknown as PathValue<T, Path<T>>);
  };
  const togglePasswordVisibility = (id: string) => {
    setShowPasswordState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
                {...register(input.label as Path<T>, {
                  required: input.require ? `${input.label} is required` : undefined,
                  validate: value => !!value || `${input.label} must be selected`
                })}
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
              <div className="relative">
                <input
                  type="time"
                  id={input.label}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  min="09:00"
                  max="18:00"
                  defaultValue={input.value}
                  required
                  {...register(`${input.label}` as Path<T>, { required: `${input.label} is required` })}
                />
              </div>
            ) : input.type === "password" ? (
              <div className="relative">
                <input
                  id={input.label}
                  type={showPasswordState[input.label] ? "text" : "password"}
                  defaultValue={input.value}
                  {...register(input.label as Path<T>, {
                    required: input.require ? `${input.label} is required` : undefined,
                  })}
                  className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(input.label)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  {showPasswordState[input.label] ? "Hide" : "Show"}
                </button>
              </div>
            ) : (
              <input
                id={input.label}
                type={input.type}
                defaultValue={input.value}
                {...register(input.label as Path<T>, {
                  required: input.require ? `${input.label} is required` : undefined,
                  pattern: input.type === "text" ? /^[A-Za-z\s]*$/ : undefined
                })}
                className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            )}

            {errors[input.label] && (
              <p className="text-red-600 text-sm mt-1">{(errors[input.label] as unknown as { message: string })?.message || `Invalid input`}</p>
            )}
          </div>
        )
      ))}

      <button
        type="submit"
        className={`${buttonColor || defaultColor} text-white px-4 py-2 rounded ${hoverColor || defaultHoverColor}`}
        disabled={loading}
      >
        {loading ? "Loading..." : buttonText || befaultText}
      </button>
    </form>
  );
};

export default Form;
