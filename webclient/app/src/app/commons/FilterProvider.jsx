import {createContext, useState} from "react";
import dayjs from "dayjs";

export const FilterContext = createContext(null);

export function FilterProvider({children}) {
    const [startDate, setStartDate] = useState(dayjs().startOf('week'));
    const [endDate, setEndDate] = useState(dayjs().endOf('week'));
    const [date, setDate] = useState(dayjs(new Date()));

    return (
        <FilterContext.Provider value={{startDate, endDate, date, setStartDate, setEndDate, setDate}}>
            {children}
        </FilterContext.Provider>
    );
}