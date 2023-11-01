import { Children, createContext, useState } from "react";

interface INavContext {
    navigationOpen: boolean
    toggle: () => void
}

export const NavigationContext = createContext<INavContext>({
    navigationOpen: false,
    toggle: () => {}
})

export const NavigationState = ({ children }: {children: React.ReactNode})  => {
    const [navigationOpen, setNav] = useState(false)
    const toggle = () => setNav(prev => !prev)

    return (
        <NavigationContext.Provider  value={{ navigationOpen, toggle }}>
            { children }
        </NavigationContext.Provider>
    )
}