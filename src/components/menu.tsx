import React from 'react';
import { IMenu } from '../models';
import { addIcons } from 'ionicons';
import { searchOutline, analyticsOutline, sendOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react'; 
import { Link } from 'react-router-dom'


interface MenuProps {
    menu:IMenu
}

addIcons({
    'search-outline': searchOutline,
    'analytics-outline': analyticsOutline,
    'send-outline':sendOutline
  
  });

export function Menu(MenuProp: MenuProps){
    return (
        <li>
            <Link to={MenuProp.menu.url}>
                <span className="icon">
                <IonIcon icon={MenuProp.menu.ion}/>
                </span>
                <span className="title">{MenuProp.menu.name}</span>
            </Link>
        </li>
    );
};