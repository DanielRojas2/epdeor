import { createContext, useState } from "react";

const LoginContext = createContext();

function LoginProviderWrapper(props) {
    const [error, setError] = useState(false);

    const iniciarSesion = async () => {
        try {
            const response = await fetch(
                'http://127.0.0.1:8000/usuarios/iniciar-sesion/'
            )
            const data = response.json()
        }catch (e) {
            setError(true);
        }
    }    

    return (
        <LoginContext.Provider>
            {props.children}
        </LoginContext.Provider>
    )
}

export {LoginContext, LoginProviderWrapper}
