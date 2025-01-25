
import { dine_24,dine_25,dine_26,dine_27 } from "../images";

export const navLinks = [
    { href: "/", label: "Home" },
    {href: "/cart", label: "Cart", id: "cart"},
];

export const categories = [
    { name: "Cakes", link: "/category/cake", image: '/00.png' },
    { name: "Dishes", link: "/category/dishes", image: '/dis.png' },
    { name: "Catered Cuisine ", link: "/category/cater", image: '/cater.png' },
    { name: "Frozen Items", link: "/category/frozen", image: '/froz.png' },
];

// food.js (or in your CategoryCard component file)
export const food = [
    { id: 1, name: "efg", image:  dine_24 ,link: "/detail/1"},
    { id: 2, name: "Mud Cake", image:  dine_24,link: "/detail/2" },
    { id: 3, name: "Jelly Cake", image:  dine_24,link: "/detail/3" },
    { id: 4, name: "Pooh Cake", image:  dine_24,link: "/detail/4" },    
  ];


export const wideCarousel_img = [
    { id: 1, image: '/2.png' },
    { id: 2, image: '/3.png' },
    { id: 3, image: '/4.png' },
    { id: 4, image: '/5.png' },
]



export const footerLinks = [
    {
        title: "Education",
        links: [
            { name: "Games", link: "/" },
            { name: "Quizzes", link: "/" },
            { name: "Awareness", link: "/" },
            { name: "View Map", link: "/" },
            { name: "Get Notifications", link: "/" },
        ],
    },
    {
        title: "Help",
        links: [
            { name: "About us", link: "/" },
            { name: "FAQs", link: "/" },
            { name: "How it works", link: "/" },
            { name: "Privacy policy", link: "/" },
        ],
    },
    {
        title: "Get in touch",
        links: [
            { name: "customer@ghg_explorer.com", link: "mailto:customer@ghg_explorer.com" },
            { name: "+92554862354", link: "tel:+92554862354" },
        ],
    },
];

export const socialMedia = [
];