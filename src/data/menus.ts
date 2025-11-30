import { IoIosHome, IoIosStats, IoIosSearch, IoIosCloudUpload, IoIosPricetag } from "react-icons/io";
import { homeOutline, analyticsOutline, searchOutline, sendOutline, pricetagOutline } from 'ionicons/icons'; // Import ionicons

export const menus = [
    {
        title: 'Главная',
        url: '/',
        icon: IoIosHome,
        ion: homeOutline // Added ionicon
    },
    {
        title: 'Статистика',
        url: '/charts',
        icon: IoIosStats,
        ion: analyticsOutline // Added ionicon
    },
    {
        title: 'Поиск по тексту',
        url: '/textsearch',
        icon: IoIosSearch,
        ion: searchOutline // Added ionicon
    },
    {
        title: 'Загрузка файла',
        url: '/sendfile',
        icon: IoIosCloudUpload,
        ion: sendOutline // Added ionicon
    },
    {
        title: 'Редактор тегов',
        url: '/tags',
        icon: IoIosPricetag,
        ion: pricetagOutline // Added ionicon
    }
]