import {
  createContext,
  useContext,
  useState,
} from "react";

const ThemeContext =
  createContext();

export const ThemeProvider =
  ({ children }) => {

    const [dark, setDark] =
      useState(false);

    return (

      <ThemeContext.Provider
        value={{
          dark,
          setDark,
        }}
      >

        {children}

      </ThemeContext.Provider>

    );

  };

export const useTheme =
  () =>
    useContext(ThemeContext);