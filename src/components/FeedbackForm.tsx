import { useState } from "react";
import { useForm,FieldValues, Path } from "react-hook-form";

interface Input {
    question: string;
    type: string;
    options?: { label: string; value: number }[]; 
}

interface FeedbackFormProps<T extends FieldValues> {
    Input: Input[];
    buttonColor?: string;
    buttonText?: string;
    hoverColor?: string;
    onSubmit: (data: T) => void;
}

const FeedbackForm = <T extends FieldValues>({ Input, onSubmit}: FeedbackFormProps<T>): JSX.Element => {
    const { register, handleSubmit } = useForm<T>();
    const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
    const [selected, setSelected] = useState<number | null>(null);
    const handleClick = (number: number) => {
        setSelected(number); // Set the selected number
        console.log(`Selected number: ${number}`); // Log or handle the selected number as needed
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {Input.map((input) => (
                input && (
                    <div key={input.question} className="mb-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                              {input.question}
                        </h3>
                        {input.type === "1-10" ? (
                            <div className="mt-16 mb-20">
                            <div className="flex flex-col items-center mt-16">
                                <div className="mb-4 grid grid-cols-3 gap-4 w-full">
                                    <div className="text-center">
                                        <p className="text-xs font-medium text-gray-500">
                                            NOT AT ALL LIKELY (1-4)
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-medium text-gray-500">MAYBE (5)</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-medium text-gray-500">
                                            EXTREMELY LIKELY (6-10)
                                        </p>
                                    </div>
                                </div>
                                {/* Buttons section */}
                                <div className="inline-flex rounded-lg shadow-sm justify-center w-full overflow-x-auto">
                                    {numbers.map((number) => (
                                        <button
                                            key={number}
                                            type="button"
                                            className={`h-10 w-14 md:h-10 md:w-32 sm:h-12 sm:w-32 lg:h-14 lg:w-28 inline-flex items-center justify-center text-base lg:text-xl font-medium border border-gray-300 rounded-md 
              ${selected === number ? "bg-red-600 text-white" : "bg-white text-gray-800"} 
              focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 
              hover:bg-red-600 hover:text-white whitespace-nowrap`}
                                            onClick={() => handleClick(number)}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        ):(
                            <input
                                id={input.question}
                                type={input.type}
                                defaultValue={input.question}
                                {...register(input.question as Path<T>, { required: `${input.question} is required` })}
                                className="mt-1 block w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        )}
                    </div>
                )
            ))}

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Submit
            </button>
        </form>
    )
}

export default FeedbackForm;