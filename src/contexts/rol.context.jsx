import { createContext, useContext, useMemo } from "react";
import { LoginContext } from "./login.context"

export const RolContext = createContext();

export function RolProvider({ children }) {
    const { user } = useContext(LoginContext);

    const roles = user?.rol || []

    const hasRol = (rol) => roles.includes(rol);

    const hasAnyRol = (rolList = []) =>
        rolList.some((rol) => roles.includes(rol))

    const value = useMemo(
        () => ({ roles, hasRol, hasAnyRol }),
        [roles.join(",")],
    );

    return <RolContext.Provider value={value}>{children}</RolContext.Provider>;
}
