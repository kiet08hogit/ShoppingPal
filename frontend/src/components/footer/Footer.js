import React from 'react';
import { Link } from 'react-router-dom';

import "../footer/footer.css"


export default function Footer() {
  return (
    <div className="footer">
    <div className="footer__top">
        <div className="footer__info">
            <h3>Join INDUSTRA Rewards</h3>
            <p>Turn your everyday orders into rewards. Bring your ideas to life with special discounts, inspiration, and lots of good things in store. It's all free. <span>See more.</span> </p>
        </div>
        <div className="footer__infoList">
            <ul>
                <li className="footer__infoLi">
                    <h5>About us</h5>
                    <div className="footer__infoLinks">
                        <li>Careers</li>
                        <li>Customers</li>
                        <li>Suppliers</li>
                        <li>Impact</li>
                        <li>Investors</li>
                        <li>Media</li>
                    </div>
                </li>
                <li className="footer__infoLi">
                    <h5>Support</h5>
                    <div className="footer__infoLinks">
                        <li>Existing Orders</li>
                        <li>Returns, Warranty and Cancellations</li>
                        <li>Extended Protection Plan</li>
                        <li>Invoices</li>
                        <li>Special Orders</li>
                    </div>
                </li>
            </ul>
        </div>
       
    </div>
    <div className="footer__social">
        <div className="footer__links">
        
          

            <div className="footer__socialIcons">
            <i className="fa-brands fa-facebook"></i>
            </div>

            <div className="footer__socialIcons">
            <i className="fa-brands fa-instagram"></i>
            </div>
           
            <div className="footer__socialIcons">
            <i className="fa-brands fa-youtube"></i>
            </div>
        </div>

    </div>
    <hr className="footer__line"/>
    <div className="footer__bottom">
        <p>&copy; INDUSTRA Inc. 2025-2026</p>
        <div className="footer__bottomTags">
            <li>Privacy policy</li>
            <li>Cookie policy</li>
            <li>Cookie settings</li>
            <li>Terms and conditions</li>
            <li>User terms and conditions </li>
            <li>Responsible Disclosure Program</li>
        </div>
    </div>
</div>
  )
}
