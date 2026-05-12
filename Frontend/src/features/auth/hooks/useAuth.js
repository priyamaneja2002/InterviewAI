import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe, loginWithGoogle } from "../services/auth.api";



export const useAuth = () => {
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context;

    const handleLogin = async ({email, password}) => {
        setLoading(true);
        try {
            const data = await login({email, password});
            setUser(data?.user ?? null);
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async ({username, email, password}) => {
        setLoading(true);

        try {
            const data = await register({username, email, password});
            setUser(data?.user ?? null);
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }

    }

    const handleGoogleLogin = async ({ credential }) => {
        setLoading(true);
        try {
            const data = await loginWithGoogle({ credential });
            setUser(data?.user ?? null);
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const getAndSetUser = async() => {
            try {
                const data = await getMe();
                setUser(data?.user ?? null);
            } catch (error) {
                console.log(error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        } 
        getAndSetUser();
    }, [setLoading, setUser]);

    return {user, loading, handleRegister, handleLogin, handleLogout, handleGoogleLogin};
}