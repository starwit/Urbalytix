import React, { createContext, useContext, useState, useEffect } from 'react';
import { AbilityProvider } from '@casl/react';
import { defineUserAbility } from './defineAbility';
import UserRest from '../services/UserRest';

const guestAbility = defineUserAbility([]);

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [ability, setAbility] = useState(guestAbility);
    const [userData, setUserData] = useState(null);

    const userRest = new UserRest();

    useEffect(() => {
        userRest.getCurrentUserInfo().then(response => {
            setUserData(response.data);
            if (response.data.authenticated === false) {
                setAbility(guestAbility);
            } else {
                setAbility(defineUserAbility(response.data.roles));
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={userData}>
            <AbilityProvider value={ability}>
                {children}
            </AbilityProvider>
        </AuthContext.Provider>
    );
}
