import { Component } from '@angular/core';

@Component({
    selector: 'app-theme-toggle',
    templateUrl: './theme-toggle.component.html',
    styleUrls: ['./theme-toggle.component.css'],
})
export class ThemeToggleComponent {
    themes = ['Light', 'Dark', 'System'];
    menuOpen = false;

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    setTheme(theme: string) {
        localStorage.setItem('theme', theme.toLowerCase());
        this.updateTheme();
        this.menuOpen = false;
    }

    getThemePreference() {
        return localStorage.getItem('theme') || 'system';
    }

    updateTheme() {
        const themePreference = this.getThemePreference();
        const isDark =
            themePreference === 'dark' ||
            (themePreference === 'system' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);

        document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
    }

    ngOnInit() {
        this.updateTheme();
        document.addEventListener('click', this.onDocumentClick.bind(this));
    }

    ngOnDestroy() {
        document.removeEventListener('click', this.onDocumentClick.bind(this));
    }

    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const clickedInside =
            target.closest('#themes-menu') || target.closest('button');
        if (!clickedInside) {
            this.menuOpen = false;
        }
    }
}
