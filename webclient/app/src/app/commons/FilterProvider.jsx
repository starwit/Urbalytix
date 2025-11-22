import {createContext, useState} from "react";
import dayjs from "dayjs";

export const FilterContext = createContext(null);

export function FilterProvider({children}) {
    const [cStartDate, setCStartDate] = useState(dayjs().startOf('week'));
    const [cEndDate, setCEndDate] = useState(dayjs().endOf('week'));

    return (
        <FilterContext.Provider value={{cStartDate, setCStartDate, cEndDate, setCEndDate}}>
            {children}
        </FilterContext.Provider>
    );
}