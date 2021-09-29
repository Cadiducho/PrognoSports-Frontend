import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";
import AuthVuexModule from "@/_store/modules/AuthModule";

const darkMode = localStorage.getItem('darkMode');

@Module({ namespaced: true })
class StyleModule extends VuexModule {
    public isDarkModeActive = darkMode ? JSON.parse(darkMode) : false;

    @Action({ rawError: true })
    darkModeToggle(): void {

        this.context.commit('toggleDarkMode');
        localStorage.setItem('darkMode', this.isDarkModeActive);

        this.context.dispatch('setDarkModeStyle');
    }

    @Action({ rawError: true })
    setDarkModeStyle(): void {
        const htmlClassName = 'is-dark-mode-active'

        if (this.isDarkModeActive) {
            document.documentElement.classList.add(htmlClassName)
        } else {
            document.documentElement.classList.remove(htmlClassName)
        }
    }

    @Mutation
    public toggleDarkMode(): void {
        this.isDarkModeActive = !this.isDarkModeActive;
    }

    get darkModeToggleIcon() {
        return this.isDarkModeActive ? 'light_mode' : 'dark_mode';
    }
}

export default StyleModule;