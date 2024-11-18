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
  defaultSelect?: number[];
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

const Form = <T extends FieldValues>({
  Input,
  onSubmit,
  buttonColor,
  buttonText,
  hoverColor,
}: FormProps<T>): JSX.Element => {
  const { register, handleSubmit, setValue } = useForm<T>();

  const [selectedMultiValue, setSelectedMultiValue] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  // Custom Input for DatePicker
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
    // Initialize default values for the multi-select field
    Input.forEach((input) => {
      if (input.type === "multiple" && input.defaultSelect) {
        setSelectedMultiValue(input.defaultSelect);
        setValue(
          input.label as Path<T>,
          input.defaultSelect as unknown as PathValue<T, Path<T>>
        );
      }
    });
  }, [Input, setValue]);

  // Handle changes in multi-select
  const handleMultiSelectChange = (selected: number[]) => {
    setSelectedMultiValue(selected);
    setValue(
      "multiSelectField" as Path<T>,
      selected as unknown as PathValue<T, Path<T>>
    );
  };

  // Handle changes in start date
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setValue("tokenStartTime" as Path<T>, date as unknown as PathValue<T, Path<T>>);
  };

  // Handle changes in expiration date
  const handleExpirationDateChange = (date: Date | null) => {
    setExpirationDate(date);
    setValue("tokenExpiration" as Path<T>, date as unknown as PathValue<T, Path<T>>);
  };

  const defaultButtonColor = "bg-blue-500";
  const defaultHoverColor = "hover:bg-blue-600";
  const defaultButtonText = "Submit";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {Input.map((input) => (
        <div key={input.label} className="mb-4">
          <label htmlFor={input.label} className="block text-sm font-medium text-gray-700">
            {input.label}
          </label>
          {input.type === "select" ? (
            <select
              id={input.label}
              {...register(input.label as Path<T>, { required: `${input.label} is required` })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select {input.label}</option>
              {input.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : input.type === "multiple" ? (
            <Listbox value={selectedMultiValue} onChange={handleMultiSelectChange} multiple>
              <ListboxButton className="block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                {selectedMultiValue.length > 0
                  ? selectedMultiValue
                    .map((value) => input.options?.find((opt) => opt.value === value)?.label)
                    .join(", ")
                  : "Select multiple options..."}
              </ListboxButton>
              <ListboxOptions className="mt-2 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {input.options?.map((option) => (
                  <ListboxOption key={option.value} value={option.value} className="cursor-pointer select-none p-2">
                    {({ selected }) => (
                      <span className={selected ? "font-semibold" : "font-normal"}>
                        {option.label}
                      </span>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          ) : input.type === "date" && input.label === "tokenStartTime" ? (
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              customInput={<CustomInput />}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          ) : input.type === "date" && input.label === "tokenExpiration" ? (
            <DatePicker
              selected={expirationDate}
              onChange={handleExpirationDateChange}
              customInput={<CustomInput />}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
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
      ))}

      <button
        type="submit"
        className={`${buttonColor || defaultButtonColor} text-white px-4 py-2 rounded ${hoverColor || defaultHoverColor}`}
      >
        {buttonText || defaultButtonText}
      </button>

    </form>
  );
};

export default Form;
