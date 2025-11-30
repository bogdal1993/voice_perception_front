import React from 'react';
import { IMenu } from '../models';
import { addIcons } from 'ionicons';
import { searchOutline, analyticsOutline, sendOutline, pricetagOutline, homeOutline } from 'ionicons/icons'; // Added homeOutline
import { IonIcon } from '@ionic/react'; 
import { Link } from 'react-router-dom'


interface MenuProps {
    menu:IMenu
}

addIcons({
    'search-outline': searchOutline,
    'analytics-outline': analyticsOutline,
    'send-outline':sendOutline,
    'pricetags-outline':pricetagOutline,
    'home-outline': homeOutline // Added homeOutline
  });

export function Menu(MenuProp: MenuProps){
    return (
        <li>
            <Link to={MenuProp.menu.url}>
                <span className="icon">
                {MenuProp.menu.ion ? <IonIcon icon={MenuProp.menu.ion}/> : MenuProp.menu.icon ? <MenuProp.menu.icon /> : null}
                </span>
                <span className="title">{MenuProp.menu.title}</span>
            </Link>
        </li>
    );
};