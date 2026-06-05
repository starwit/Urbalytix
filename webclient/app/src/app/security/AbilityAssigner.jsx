import React, {useState, useEffect} from 'react';
import {AbilityProvider} from '@casl/react';
import {defineUserAbility} from './defineAbility';
import UserRest from "../services/UserRest";

// Initialize with guest ability (no roles)
const guestAbility = defineUserAbility([]);

export function AbilityAssigner({children}) {
    const [ability, setAbility] = useState(guestAbility);

    const userRest = new UserRest();

    useEffect(() => {
        userRest.getCurrentUserInfo().then(response => {
            if (response.data.authenicated === false) {
                setAbility(guestAbility);
            } else {
                setAbility(defineUserAbility(response.data.roles));
                console.log(defineUserAbility(response.data.roles));
            }
        });
    }, []);

    return (
        <AbilityProvider value={ability}>
            {children}
        </AbilityProvider>
    );
}
