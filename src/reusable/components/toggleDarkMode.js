

import { Brightness4, Brightness7 } from "@mui/icons-material"; // Import Material-UI icons
import { IconButton } from "@mui/material";
import { useThemeMode } from "../../providers/ThemeContext";


const ToggleDarkMode = ({ className }) => {

    const { darkMode, toggleTheme } = useThemeMode();

    return (
        <IconButton onClick={toggleTheme} color="inherit" className={className}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
    )
}
export default ToggleDarkMode