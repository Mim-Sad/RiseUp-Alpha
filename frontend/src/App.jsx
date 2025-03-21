import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import Lottie from 'lottie-react';
import './App.css';
// Import your SVG files
import sendIcon from './assets/icon/launch.svg';
import loadingIcon from './assets/icon/more.svg';
import menuIcon from './assets/icon/menu.svg';
import closeIcon from './assets/icon/close.svg'
// Import your Image files
import miniLogo from './assets/logo/ru-logo-w.png';
import mainBackground from './assets/bg/abstract_design.jpg';
// Import your Lottie animation file
import welcomeAnimation from './assets/lottie/bubble.json';
import thinkingAnimation from './assets/lottie/three-dots.json';
import loadAnimation from './assets/lottie/dot-breathing.json';

// کامپوننت سفارشی برای مدیریت جدول
const TableWrapper = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <div style={{ display: 'none' }}>
        {children}
      </div>

      <div>
        <div className='preview-table-area'>
          <table className='preview-table-table'>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Country</th>
            </tr>
            <tr>
              <td>Alfreds</td>
              <td>Maria</td>
              <td>Germany</td>
            </tr>
            <tr>
              <td>Moctezuma</td>
              <td>Francisco</td>
              <td>Mexico</td>
            </tr>
            <tr>
              <td>Handel</td>
              <td>Roland</td>
              <td>Austria</td>
            </tr>

          </table>
          <button className='preview-table-button' onClick={() => setModalVisible(true)}>
          <i class="fa-duotone fa-regular fa-table-list"></i>
          <span>
            مشاهده جدول
          </span>
            </button>
        </div>
      </div>

      {modalVisible && (
        <div className="lightbox-overlay" onClick={() => setModalVisible(false)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <div className='popup-table-area'>
              <table className='popup-view-table'>
                {children}
              </table>
            </div>
            <div className='popup-toolbar'>
              <button className="popup-close-button" onClick={() => setModalVisible(false)}>
                <i class="fa-duotone fa-regular fa-circle-xmark"></i>
                <span>
                  بستن
                </span>
              </button>
              <button className="popup-print-button" onClick={printTable}>
                <i class="fa-duotone fa-regular fa-print"></i>
                <span>
                  پرینت
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// تابع چاپ
const printTable = () => {
  // انتخاب عنصر جدول با استفاده از کلاس
  const table = document.querySelector('.popup-view-table');
  if (!table) return;

  // گرفتن تمامی تگ‌های استایل و لینک‌های CSS موجود در صفحه
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join('');

  // Check if it's a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // For mobile devices, create a data URL and open it in a new tab
    const printContent = `
      <!DOCTYPE html>
      <html lang="fa">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <title>Print Table</title>
          ${styles}
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @font-face {
              font-family: 'AlibabaAi';
              src: url('https://cdn.alibaba.ir/h2/desktop/assets/fonts/alibaba/alibaba-regular.woff2-5d2979c4.woff2') format('woff2');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            body {
              font-family: 'AlibabaAi', Tahoma, Arial, sans-serif;
              direction: rtl;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body class="print-layout">
          ${table.outerHTML}
          <script>
            // Auto-print when loaded (works on some mobile browsers)
            window.onload = function() {
              try {
                setTimeout(() => window.print(), 1000);
              } catch (e) {
                console.error('Print failed:', e);
              }
            };
          </script>
        </body>
      </html>
    `;

    // Create a blob with UTF-8 encoding and open it in a new tab
    const blob = new Blob([printContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  } else {
    // Original desktop printing logic with improved encoding
    const newWin = window.open('', '_blank', 'width=800,height=600');
    newWin.document.open();
    newWin.document.write(`
      <!DOCTYPE html>
      <html lang="fa">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <title>Print Table</title>
          ${styles}
          <style>
            @font-face {
              font-family: 'AlibabaAi';
              src: url('https://cdn.alibaba.ir/h2/desktop/assets/fonts/alibaba/alibaba-regular.woff2-5d2979c4.woff2') format('woff2');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            body {
              font-family: 'AlibabaAi', Tahoma, Arial, sans-serif;
              direction: rtl;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body class="print-layout">
          ${table.outerHTML}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();

    // دستور چاپ و سپس بستن پنجره
    newWin.print();
    newWin.close();
  }
};


function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize the handleFormSubmit function with App's state setters
  useEffect(() => {
    handleFormSubmit.appHandleSubmit = handleSubmit;
    handleFormSubmit.appSetInput = setInput;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare messages for API
      const messageHistory = [...messages, userMessage].map(({ role, content }) => ({
        role,
        content,
      }));

      // Create a new AI message placeholder
      const aiMessageId = Date.now().toString();
      setMessages((prev) => [...prev, { role: 'assistant', content: '', id: aiMessageId }]);

      // Set up event source for streaming
      const apiServerIp = import.meta.env.VITE_API_SERVER_IP || "192.168.1.5"
      const apiServerPort = import.meta.env.VITE_API_SERVER_PORT || "5000"
      const apiServerAddress = `http://${apiServerIp}:${apiServerPort}/api/chat`;

      console.log(apiServerAddress)

      const response = await fetch(apiServerAddress, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messageHistory }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            if (data === '[DONE]') {
              break;
            } else {
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  aiResponse += parsed.content;
                  // Update the AI message with the accumulated response
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId ? { ...msg, content: aiResponse } : msg
                    )
                  );
                }
              } catch (e) {
                console.error('Error parsing streaming response:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, there was an error processing your request.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='back-root' style={{ backgroundImage: `url(${mainBackground})` }}>
      <div className='root-area'>
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className='sidebar-haeder-info'>

              <img src={miniLogo} alt="RiseUp Logo" className="sidebar-haeder-info-logo" />

              <div className='sidebar-header-info-name'>
                <h1>RiseUp</h1>
                <h2>Right Now!</h2>
              </div>

            </div>

            <button className="inner-sidebar-toggle sidebar-toggle" onClick={toggleSidebar}>
              <img src={closeIcon} alt="close" width="40px" height="40px" />
            </button>

          </div>
          <div className="sidebar-content">
            <button className="new-chat-button">
              <span>
                گفتگوی جدید +
              </span>
            </button>
            <div className="chat-history">
              {/* Placeholder for chat history */}
              <button className="chat-item active">
                <span>
                  گفتگوی جاری
                </span>
              </button>
              <button className="chat-item">
                <span>
                  گفتگوی پیشین
                </span>
              </button>
              <button className="chat-item">
                <span>
                  گفتگوی آرشیو
                </span>
              </button>
              <button className="chat-item">
                <span>
                  گفتگوی پین شده
                </span>
              </button>
            </div>
          </div>
          <div className="sidebar-footer">
            <button className="profile-button">
              <span>
                تنظیمات پروفایل
              </span>
            </button>
          </div>
        </div>

        <div className="chat-container">
          <header className="chat-header">
            <div className='chat-header-option-area'>
              <button className="sidebar-toggle" onClick={toggleSidebar}>
                <img src={menuIcon} alt="menu" width="30" height="30" />
              </button>
            </div>

            <div className='chat-header-name-area'>
              {/* <img className='logo-in-header' src={miniLogo} alt="Logo" /> */}
              <span>هوش مصنوعی</span>
              <h1>رایـــزآپ!</h1>
            </div>
          </header>

          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <Lottie
                  animationData={welcomeAnimation}
                  loop={true}
                  style={{ opacity: 1 }}
                  className='welcome-lottie-desktop'
                />
                <Lottie
                  animationData={loadAnimation}
                  loop={true}
                  style={{ opacity: 1 }}
                  className='welcome-lottie-mobile'
                />

                <h2>خوش اومدی به RiseUp</h2>
                <p>شوالیه تاریکی بر می‌خیزد؟ شاید وقتشه تو هم پاشی! من کمکت میکنم...</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-content">
                    {message.role === 'assistant' ? (
                      message.content ? (
                        <ReactMarkdown
                          components={{ table: TableWrapper }}
                          remarkPlugins={[remarkGfm]}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <Lottie
                          animationData={thinkingAnimation}
                          loop={true}
                          style={{ opacity: 1 }}
                          className="thinking-lottie"
                        />
                      )
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className='chat-footer-area'>
            <div className='input-form-area'>
              <form className="input-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="هر چه میخواهد دل تنگت بگو..."
                // disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()}>
                  {isLoading ? (
                    // <img src={loadingIcon} alt="Loading" width="30" height="30" />
                    <Lottie
                      animationData={loadAnimation}
                      loop={true}
                      style={{ opacity: 1 }}
                      className="loading-lottie"
                    />
                  ) : (
                    <img src={sendIcon} alt="Send" width="30" height="30" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Function to handle form data submission from external components
const handleFormSubmit = (formData) => {
  // Convert form data to a string message
  const formMessage = typeof formData === 'string' 
    ? formData 
    : JSON.stringify(formData);
  
  // Create a synthetic event to pass to handleSubmit
  const syntheticEvent = { preventDefault: () => {} };
  
  // Get the App's handleSubmit function and input setter
  // This will be initialized by the App component
  let appHandleSubmit = null;
  let appSetInput = null;
  
  // Set the input value to the form message
  if (appSetInput) {
    appSetInput(formMessage);
  }
  
  // Call handleSubmit with the synthetic event
  if (appHandleSubmit) {
    appHandleSubmit(syntheticEvent);
  }
};

// Export both the App component and the handleFormSubmit function
export { App as default, handleFormSubmit };
