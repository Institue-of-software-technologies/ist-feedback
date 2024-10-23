"use client"
import React, { useState } from 'react';

export default function StudentFeedback() {
    const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
    const [selected, setSelected] = useState<number | null>(null);
    const handleClick = (number: number) => {
        setSelected(number); // Set the selected number
        console.log(`Selected number: ${number}`); // Log or handle the selected number as needed
    };
    return (
        <>
            <div className="bg-gray-100 min-h-screen text-black p-1 sm:p-1 md:p-16 lg:p-16">
                <div className="bg-white min-h-screen rounded-3xl text-black p-5 sm:p-7 md:p-10 lg:p-10">
                    <div className="text-center">
                        <h1 className="text-red-600 text text-2xl">STUDENT FEEDBACK QUESTIONS FOR <b>JANUARY INTAKE 2024</b></h1>
                    </div>
                    <div className="mt-16 mb-20">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            1. How likely is it that you would recommend this company to a friend or
                            colleague?
                        </h3>
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
                    <div className="mt-16 mb-20">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            2. Overall, how satisfied or dissatisfied are you with our company?
                        </h3>
                        <div className="flex flex-col space-y-2">

                            <div className="flex items-center mt-7">
                                <input type="checkbox" id="reliable" name="reliable" value="Reliable" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="reliable" className="ml-2 block text-lg text-gray-900"> Reliable</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="high_quality" name="high_quality" value="High quality" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="high_quality" className="ml-2 block text-lg text-gray-900"> High quality</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="useful" name="useful" value="Useful" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="useful" className="ml-2 block text-lg text-gray-900"> Useful</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="unique" name="unique" value="Unique" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="unique" className="ml-2 block text-lg text-gray-900"> Unique</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="good_value" name="good_value" value="Good value for money" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="good_value" className="ml-2 block text-lg text-gray-900"> Good value for money</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="overpriced" name="overpriced" value="Overpriced" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="overpriced" className="ml-2 block text-lg text-gray-900"> Overpriced</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="impractical" name="impractical" value="Impractical" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="impractical" className="ml-2 block text-lg text-gray-900"> Impractical</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="ineffective" name="ineffective" value="Ineffective" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="ineffective" className="ml-2 block text-lg text-gray-900"> Ineffective</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="poor_quality" name="poor_quality" value="Poor quality" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="poor_quality" className="ml-2 block text-lg text-gray-900"> Poor quality</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="unreliable" name="unreliable" value="Unreliable" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor={"unreliable"} className="ml-2 block text-lg text-gray-900"> Unreliable</label>
                            </div>

                        </div>
                        <div className="mt-16 mb-20 w-full">
                            <p className="mb-6">
                                1. How likely is it that you would recommend this company to a friend or colleague?
                            </p>

                            <div className="w-full">
                                {/* Labels section */}
                                <div className="mb-4 grid grid-cols-10 gap-4 w-full">
                                    <div className="col-span-4 text-center">
                                        <p className="text-xs font-medium text-gray-500">
                                            NOT AT ALL LIKELY (1-4)
                                        </p>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <p className="text-xs font-medium text-gray-500">MAYBE (5)</p>
                                    </div>
                                    <div className="col-span-4 text-center">
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


                    </div>

                    <div>
                        <h3>3. Which of the following words would you use to describe our products? Select all that apply.</h3>
                        <div className="flex flex-col space-y-2">

                            <div className="flex items-center mt-7">
                                <input type="checkbox" id="reliable" name="reliable" value="Reliable" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="reliable" className="ml-2 block text-lg text-gray-900"> Reliable</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="high_quality" name="high_quality" value="High quality" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="high_quality" className="ml-2 block text-lg text-gray-900"> High quality</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="useful" name="useful" value="Useful" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="useful" className="ml-2 block text-lg text-gray-900"> Useful</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="unique" name="unique" value="Unique" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="unique" className="ml-2 block text-lg text-gray-900"> Unique</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="good_value" name="good_value" value="Good value for money" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="good_value" className="ml-2 block text-lg text-gray-900"> Good value for money</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="overpriced" name="overpriced" value="Overpriced" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="overpriced" className="ml-2 block text-lg text-gray-900"> Overpriced</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="impractical" name="impractical" value="Impractical" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="impractical" className="ml-2 block text-lg text-gray-900"> Impractical</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="ineffective" name="ineffective" value="Ineffective" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="ineffective" className="ml-2 block text-lg text-gray-900"> Ineffective</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="poor_quality" name="poor_quality" value="Poor quality" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="poor_quality" className="ml-2 block text-lg text-gray-900"> Poor quality</label>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="unreliable" name="unreliable" value="Unreliable" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor={"unreliable"} className="ml-2 block text-lg text-gray-900"> Unreliable</label>
                            </div>

                        </div>
                    </div>
                    <div className="mt-16 mb-20">
                        <h3> 4. Do you have any other comments, questions, or concerns?</h3>
                        <div className="max-w-lg space-y-3 mt-4"> {/* Increased max width */}
                            <textarea
                                className="w-full h-32 py-4 px-4 block border border-gray-300 rounded-lg text-sm text-black focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                rows={6}
                                placeholder="This is a textarea placeholder">
                            </textarea>
                        </div>
                    </div>
                    <div className="mt-16 mb-5 w-full">
                        <button className='py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white  focus:ring-red-500 focus:ring-offset-2 
              hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none'>Submit Feedback</button>
                    </div>
                </div>
            </div>
        </>
    );
}
