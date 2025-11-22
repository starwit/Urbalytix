import {createContext, useState} from "react";
import dayjs from "dayjs";

export const FilterContext = createContext();

export function FilterProvider({children}) {
    const [startDate, setStartDate] = useState(dayjs().startOf('week'));
    const [endDate, setEndDate] = useState(dayjs().endOf('week'));
    const [date, setDate] = useState(dayjs(new Date()));

    const [objectClasses, setObjectClasses] = useState([]);
    const [selectedObjectClasses, setSelectedObjectClasses] = useState();

    return (
        <FilterContext.Provider value={{
            startDate,
            endDate,
            date,
            setStartDate,
            setEndDate,
            setDate,
            objectClasses,
            setObjectClasses,
            selectedObjectClasses,
            setSelectedObjectClasses
        }}>
            {children}
        </FilterContext.Provider>
    );
}