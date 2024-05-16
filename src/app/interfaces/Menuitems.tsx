export interface MenuItem {
    title: string;
    route?: string;
    children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        title: "Home",
        route: "/",
    },
    {
        title: "QR Codes",
        route: "/qrcodes",
    },
];
