import React from 'react';
import { menus } from '../data/menus';
import { Menu } from './menu';
import { IoIosMenu} from "react-icons/io";
import { NavigationContext } from '../context/navContext';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate


export function Navigation(){
    const Inav = React.useContext(NavigationContext)
    const navigate = useNavigate(); // Initialize useNavigate

    const navigationActiveClassname = Inav.navigationOpen ? 'active' : ''
    const navigationClassnames = ['navigation',navigationActiveClassname]

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login'); // Redirect to login page after logout
    };

    const isLoggedIn = localStorage.getItem('accessToken'); // Check if user is logged in

    return(
        
            <div className={navigationClassnames.join(' ')}>
                <ul>
                    <div className="toggle" onClick={() => Inav.toggle()}>
                        <IoIosMenu/>
                    </div>
                    {menus.map(menuP =>  <Menu key={menuP.url} menu={menuP}/>)}
                    {isLoggedIn ? (
                        <>
                            <li>
                                <Link to="/admin" onClick={() => Inav.toggle()}>
                                    <span className="icon"></span>
                                    <span className="title">Admin Panel</span>
                                </Link>
                            </li>
                            <li>
                                <a href="#" onClick={handleLogout}>
                                    <span className="icon"></span>
                                    <span className="title">Logout</span>
                                </a>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/login" onClick={() => Inav.toggle()}>
                                <span className="icon"></span>
                                <span className="title">Login</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
    );
};
