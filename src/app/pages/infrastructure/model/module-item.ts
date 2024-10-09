export interface ModuleItem {
    name: string | undefined;
    selected: boolean | undefined;
}

export interface ModuleSelection {
    modules: ModuleItem[] | undefined;
    onlyObjects: boolean | undefined;
    noObjects: boolean | undefined;
}
