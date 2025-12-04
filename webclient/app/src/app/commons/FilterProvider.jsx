import {createContext, useState} from "react";
import dayjs from "dayjs";

export const FilterContext = createContext();

export function FilterProvider({children}) {
    const [startDate, setStartDate] = useState(dayjs().startOf('week'));
    const [endDate, setEndDate] = useState(dayjs().endOf('week'));
    const [date, setDate] = useState(dayjs());
    const [showDistricts, setShowDistricts] = useState(false);

    const [objectClasses, setObjectClasses] = useState([]);
    const [selectedObjectClasses, setSelectedObjectClasses] = useState([]);
    const [featureKeys, setFeatureKeys] = useState([]);
    const [types, setTypes] = useState(['heatmap', 'hexagon']);

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
            setSelectedObjectClasses,
            featureKeys,
            setFeatureKeys,
            showDistricts,
            setShowDistricts,
            types,
            setTypes
        }}>
            {children}
        </FilterContext.Provider>
    );
}