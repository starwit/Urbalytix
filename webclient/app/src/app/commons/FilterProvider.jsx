import {createContext, useState} from "react";
import dayjs from "dayjs";

export const FilterContext = createContext();

export function FilterProvider({children}) {
    const [startDate, setStartDate] = useState(dayjs().day(1).startOf('day'));
    const [endDate, setEndDate] = useState(dayjs().add(1, 'week').day(0).endOf('day'));
    const [showDistricts, setShowDistricts] = useState(false);

    const [objectClasses, setObjectClasses] = useState([]);
    const [selectedObjectClasses, setSelectedObjectClasses] = useState([]);
    const [featureKeys, setFeatureKeys] = useState([]);
    const [types, setTypes] = useState(['heatmap', 'hexagon']);

    return (
        <FilterContext.Provider value={{
            startDate,
            endDate,
            setStartDate,
            setEndDate,
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