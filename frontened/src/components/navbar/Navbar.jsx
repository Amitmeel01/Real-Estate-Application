import React, { useContext, useState } from 'react';
import './Navbar.scss';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNotificationStore } from '../../lib/notificaton';

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if (currentUser) fetch();

  const handleLinkClick = () => {
    setSidebar(false);
  };

  return (
    <nav>
      <div className='left'>
        <div className="logo">
          <img src="/image/real-estate-logo.jpg" alt="Logo" />
        </div>
        <Link to='/'>Home</Link>
        <Link to='/'>About</Link>
        <Link to='/'>Contact</Link>
        <Link to='/list'>List</Link>
      </div>
      <div className='right'>
        {currentUser ? (
          <div className='user'>
            <img className='img' src={currentUser.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s"} alt="" />
            <span className='name'>{currentUser.username}</span>
            <Link to='/profile' className='profile' onClick={handleLinkClick}>
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to='/login' onClick={handleLinkClick}>Sign In</Link>
            <Link to='/register' className='register' onClick={handleLinkClick}>Sign Up</Link>
          </>
        )}
        <div className="menuIcon" onClick={() => setSidebar(!sidebar)}>
          <img src="/image/menu-icon.png" alt="Menu" />
        </div>
        <div className={sidebar ? "menu active" : "menu"}>
          <Link to='/' onClick={handleLinkClick}>Home</Link>
          <Link to='/about' onClick={handleLinkClick}>About</Link>
          <Link to='/contact' onClick={handleLinkClick}>Contact</Link>
          <Link to='/list' onClick={handleLinkClick}>List</Link>
          {!currentUser && (
            <>
              <Link to='/login' onClick={handleLinkClick}>Sign In</Link>
              <Link to='/register' onClick={handleLinkClick}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
