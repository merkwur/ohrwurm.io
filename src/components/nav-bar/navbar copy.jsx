import React, { memo, useEffect, useRef, useState } from 'react'
import { menuContent } from '../node-system/node-helpers/nodelist'
import "./navbar.scss"
import { colorScheme } from '../node-system/node-helpers/helperFunctions'
import { description } from '../node-system/node-helpers/tooltips'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArchive, faFileLines } from '@fortawesome/free-solid-svg-icons'

const Navbar = memo(({getNodeInfo}) => {
  const [active, setActive] = useState(null)
  const [nodeInfo, setNodeInfo] = useState({name: null, type: null})
  const [isDragging, setIsDragging] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState(false)
  const [node, setNode] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)
  const itemRef = useRef() 
  const contentRef = useRef()
  const scrollContainerRef = useRef(null);

  const handleMouseEnter = (key) => {
    setActive(key);
    
    if(!openSubMenu) {
      setOpenSubMenu(true)
    }
  };


  const handleWheel = (e) => {
    if (scrollContainerRef.current) {
      e.preventDefault(); // Prevents vertical scrolling
      scrollContainerRef.current.scrollLeft += e.deltaY; // Adjusts horizontal scroll
    }
  };

  const handleMouseLeave = (key) => {
    contentRef[key].removeEventListener("mouseenter", handleMouseEnter);
    contentRef[key].removeEventListener("mouseleave", handleMouseLeave);
  }
  

  const handleMouseDown = (event) => {
    event.preventDefault()
    setNodeInfo({ name: event.currentTarget.id, type: active });
    setIsDragging(true)
  }

  const handleMouseMove = (event) => {
    event.preventDefault()
    
  }
  const handleMouseUp = (event) => {
    const x = event.clientX
    const y = event.clientY
    setIsDragging(false)
    getNodeInfo(x, y, nodeInfo);
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  useEffect(() => {
    if (openMenu) {
      const mouseEnterHandlers = {};
      const mouseLeaveHandlers = {};
    
      Object.keys(menuContent).forEach((key) => {
        mouseEnterHandlers[key] = () => handleMouseEnter(key);
        mouseLeaveHandlers[key] = () => handleMouseLeave(key);
    
        if (contentRef[key]) {
          contentRef[key].addEventListener('mouseenter', mouseEnterHandlers[key]);
          contentRef[key].addEventListener('mouseleave', mouseLeaveHandlers[key]);
        }
      });
    
      // Cleanup
      return () => {
        Object.keys(menuContent).forEach((key) => {
          if (contentRef[key]) {
            contentRef[key].removeEventListener('mouseenter', mouseEnterHandlers[key]);
            contentRef[key].removeEventListener('mouseleave', mouseLeaveHandlers[key]);
          }
        });
      };
    }
  }, [openMenu]);

  const toggleNavbar = () => {
    setOpenMenu(!openMenu); // Toggle the openMenu state
  };


  useEffect(() => {
    if (openMenu) {
      // Add wheel event listener
      const currentScrollContainer = scrollContainerRef.current;
      if (currentScrollContainer) {
        currentScrollContainer.addEventListener('wheel', handleWheel);
      }
  
      // Cleanup
      return () => {
        if (currentScrollContainer) {
          currentScrollContainer.removeEventListener('wheel', handleWheel);
        }
      };
    }
  }, [openMenu]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } 
  }, [isDragging])


  return (
    <>
    {
      openMenu ? (

        <div 
          className='navbar-container'
        >
          <div className='navbar'>
            <div className='navbar-main-components'>
              {Object.keys(menuContent).map(key => (
                <React.Fragment key={key}>
                  <div 
                    ref={(ref) => contentRef[key] = ref} 
                    className='navbar-component-header'
                    style={{
                            borderBottom: `1px solid ${colorScheme[key]}`,
                          }}
                  > {key} </div>  
                </React.Fragment>
              ))}
            </div>
            <div 
              className='navbar-selectable-elements'
              ref={scrollContainerRef} 

            >
              {openSubMenu && active ? (
                <>
                  {menuContent[active].map(item => (
                    <div 
                      id={item}
                      className='items'
                      key={item}
                      style={{backgroundColor: colorScheme[active]}}
                      ref={(ref) => itemRef[item] = ref}
                      onMouseDown={(event) => handleMouseDown(event)}
                      onMouseEnter={() => setNode(item)}
                      
                    >
                      {item}
                    </div>
                  ))}
                </>
              ) : null}
            </div>
            <div className='tooltips'>
              <div className='title'>
                {active}
              </div>
              <div className='subtitle'>
                {node}
                <a 
                  href={`https://tonejs.github.io/docs/14.7.77/${node}`}
                  target='_blank'
                  style={{cursor: "help"}}
                
                >
                  <FontAwesomeIcon icon={faFileLines}/>
                </a>
              </div>
              <div className='description'>
                <div className='text'>
                  {description[node]}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null
    }
      <div onClick={toggleNavbar} 
        className="navbar-toggle-button"
        style={{
            position: "absolute",
            height: '24px',
            width: "40px",
            left: ".75rem",
            top: openMenu ? "20%" : "0%",
            backgroundColor: '#171717',
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18pt",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            fontWeight: "800",
            borderBottom: "1px solid #77777777",
             
            
        }}  
        >
        {openMenu ? '^' : 'v'} 
      </div>
    </>
  );
})
export default Navbar
