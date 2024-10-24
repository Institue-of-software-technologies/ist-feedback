"use client";

import React, { useEffect, useState } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Path, useForm, FieldValues, PathValue } from "react-hook-form";

interface Input {
  label: string;
  type: string;
  value?: string;
  defultSelect?: number[];
  options?: { label: string; value: number }[];
}

interface FormProps<T extends FieldValues> {
  Input: Input[];
  onSubmit: (data: T) => void;
}

const Form = <T extends FieldValues>({ Input, onSubmit }: FormProps<T>): JSX.Element => {
  const { register, handleSubmit, setValue } = useForm<T>();

  // State to track the selected options in the multi-select Listbox
  const [SelectedValue, setSelectedValue] = useState<number[]>([]);

  useEffect(() => {
    // Set default values for the multi-select if provided
    Input.forEach((input) => {
      if (input.type === "multiple" && input.defultSelect) {
        console.log(input.defultSelect);
        setSelectedValue(input.defultSelect);
        setValue(input.label as Path<T>, input.defultSelect as unknown as PathValue<T, Path<T>>);
      }
    });
  }, [Input, setValue]);

  const handleMultiSelectChange = (selected: number[]) => {
    setSelectedValue(selected);
    setValue("multiSelectField" as Path<T>, selected as unknown as PathValue<T, Path<T>>); // Register the selected values in the form
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
                <option value="">Select {input.label}</option>
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
            ) : input.type === "time-range" ? (
              <>
                <div>
                  <label htmlFor="start-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start time:</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <input type="time" id="start-time" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" value="00:00" required />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="end-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End time:</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <input type="time" id="end-time" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="09:00" max="18:00" value="00:00" required />
                  </div>
                </div>
              </>
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

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default Form;
