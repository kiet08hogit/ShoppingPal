import React, { useState } from 'react';
import '../copilot-iframe.css'; // Assuming this file is in src/

const CopilotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAgent = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div id="agentContainer">
            <div id="webchatContainer" className={isOpen ? "active" : ""}>
                <div id="chatBanner">
                    Industra Assistant
                </div>
                {/* 
                  Using the iframe approach as seen in index.html.
                  This avoids needing the full BotFramework WebChat SDK for now.
                */}
                <iframe
                    src="https://copilotstudio.microsoft.com/environments/Default-e202cd47-7a56-4baa-99e3-e3b71a7c77dd/bots/copilots_header_9ffd6/webchat?__version__=2"
                    className="copilot-iframe"
                    title="Industra Assistant"
                >
                </iframe>
            </div>
            <button id="agentButton" onClick={toggleAgent}>
                {isOpen ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-message"></i>}
            </button>
        </div>
    );
};

export default CopilotWidget;
