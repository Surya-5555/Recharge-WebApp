import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../lib/constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm sm:btn-md">
        <PaletteIcon className="h-4 w-4 sm:h-5 sm:w-5 text-base-content opacity-70" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-300 max-h-80 overflow-y-auto mt-2"
      >
        {THEMES.map((t) => (
          <li key={t.name}>
            <button
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                theme === t.name ? "bg-primary text-primary-content" : "hover:bg-base-300"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTheme(t.name);
              }}
            >
              <div className="flex gap-1">
                {t.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-base-content/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSelector;