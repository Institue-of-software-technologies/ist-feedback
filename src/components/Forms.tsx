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
  readonly?: boolean;
  value?: string | number;
  valueDate?: Date | null;
  name?: string;
  defaultSelect?: number[];
  options?: { label: string; value: number | string }[];
}

export interface Buttons {
  label: string;
  type: string;
  buttonLoading?: boolean;
  buttonColor?: string;
  buttonText?: string;
  hoverColor?: string;
  onClick: () => void;
}

interface FormProps<T extends FieldValues> {
  Input: Input[];
  buttonColor?: string;
  buttonText?: string;
  hoverColor?: string;
  addButton?: Buttons[];
  loading?: boolean;
  buttonVisible?: boolean;
  onSubmit: (data: T) => void;
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}
const Form = <T extends FieldValues>({
  Input,
  onSubmit,
  addButton,
  buttonColor,
  buttonText,
  hoverColor,
  loading,
  buttonVisible = true
}: FormProps<T>): JSX.Element => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<T>();

  const [selectedMultiValue, setSelectedMultiValue] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [showPasswordState, setShowPasswordState] = useState<{ [key: string]: boolean }>({});

  const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({ value, onClick }, ref) => (
      <div className="relative w-auto">
        <input
          onClick={onClick}
          value={value || ""}
          ref={ref}
          readOnly
          className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
      if (input.type === "select" && input.value) {
        setValue(input.label as Path<T>, input.value as PathValue<T, Path<T>>);
      }
      if (input.type === "date" && input.label === "tokenStartTime" && input.valueDate) {
        setStartDate(new Date(input.valueDate)); // Ensure valid date object
        setValue("tokenStartTime" as Path<T>, new Date(input.valueDate) as PathValue<T, Path<T>>);
      }
      if (input.type === "date" && input.label === "tokenExpiration" && input.valueDate) {
        setExpirationDate(new Date(input.valueDate)); // Ensure valid date object
        setValue("tokenExpiration" as Path<T>, new Date(input.valueDate) as PathValue<T, Path<T>>);
      }
    });
  }, [Input, setValue]);

  const handleMultiSelectChange = (selected: number[]) => {
    setSelectedMultiValue(selected);
    setValue(
      "multiSelectField" as Path<T>,
      selected as unknown as PathValue<T, Path<T>>
    );
  };

  // Handle changes in start date
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
      setValue("tokenStartTime" as Path<T>, date as PathValue<T, Path<T>>);
    }
  };

  const handleExpirationDateChange = (date: Date | null) => {
    if (date) {
      setExpirationDate(date);
      setValue("tokenExpiration" as Path<T>, date as PathValue<T, Path<T>>);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
              defaultValue={input.value || ""}
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
            <div className="w-auto">
              <DatePicker
                selected={startDate}
                onChange={(date) => handleStartDateChange(date)}
                customInput={<CustomInput />}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
          ) : input.type === "date" && input.label === "tokenExpiration" ? (
            <DatePicker
              selected={expirationDate}
              onChange={(date) => handleExpirationDateChange(date)}
              customInput={<CustomInput />}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
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
                  pattern: {
                    value: /^(?!.*[.*\\\/ ])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[^\s.*\\\/]{8,}$/,
                    message: "Password must be at least 8 characters long, include uppercase and lowercase letters, at least one number, one special character (!@#$%^&), and must not contain ., space, *, /, or \\."
                  }
                })}
                className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(input.label)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label="Toggle password visibility"
              >
                {showPasswordState[input.label] ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.292.992-.734 1.93-1.318 2.782M15 12a3 3 0 01-6 0m10.317 2.783A9.969 9.969 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.973 9.973 0 011.318-2.783"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          ) : input.type === "email" ? (
            <input
              id={input.label}
              type={input.type}
              readOnly={input.readonly || false}
              defaultValue={input.value}
              {...register(input.label as Path<T>, {
                required: input.require ? `${input.label} is required` : undefined,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address"
                }
              })}
              className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <input
              id={input.label}
              type={input.type}
              defaultValue={input.value}
              {...register(input.label as Path<T>, {
                required: input.require ? `${input.label} is required` : undefined,
                pattern: input.type === "text" ? /^[A-Za-z0-9\s_.?-]*$/ : undefined
              })}
              className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

          )}

          {errors[input.label] && (
            <p className="text-red-600 text-sm mt-1">{(errors[input.label] as unknown as { message: string })?.message || `Invalid input`}</p>
          )}
        </div>
      )
      )}

      <div className="flex space-x-4">
        {buttonVisible && (
          <button
            type="submit"
            className={`${buttonColor || defaultButtonColor} text-white px-4 py-2 rounded ${hoverColor || defaultHoverColor} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              buttonText || defaultButtonText
            )}
          </button>
        )}

        {addButton?.map((button, index) => (
          <button
            key={index} // Use a unique key for each button
            type="button"
            className={`${button.buttonColor || buttonColor || defaultButtonColor} text-white px-4 py-2 rounded ${button.hoverColor || hoverColor || defaultHoverColor} ${button.buttonLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={button.onClick} // Attach the onClick handler provided in the Buttons object
            disabled={button.buttonLoading} // Disable button while loading
          >
            {button.buttonLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              button.label || buttonText || defaultButtonText // Use button-specific label if available
            )}
          </button>
        ))}
      </div>


    </form>
  );
};

export default Form;