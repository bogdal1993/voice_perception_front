import React from 'react';
//import { MenuOutline } from 'react-ionicons'
import { menus } from '../data/menus';
import { Menu } from './menu';
import { IoIosMenu} from "react-icons/io";
import { NavigationContext } from '../context/navContext';
import FileForm from '../pages/SendFileForm';



export function Navigation(){
    //const [navVisible, setnavVisible] = React.useState(false)
    const Inav = React.useContext(NavigationContext)

    const navigationActiveClassname = Inav.navigationOpen ? 'active' : ''
    const navigationClassnames = ['navigation',navigationActiveClassname]

    return(
        
            <div className={navigationClassnames.join(' ')}>
                <ul>
                    <div className="toggle" onClick={() => Inav.toggle()}>
                        <IoIosMenu/>
                    </div>
                    {menus.map(menuP =>  <Menu menu={menuP}/>)}
                    
                </ul>
            </div>
    );
};