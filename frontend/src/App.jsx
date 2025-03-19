import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import Lottie from 'lottie-react';
import './App.css';
// Import your SVG files
import sendIcon from './assets/icon/launch.svg';
import loadingIcon from './assets/icon/more.svg';
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
          <button className='preview-table-button' onClick={() => setModalVisible(true)}>مشاهده جدول</button>
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
              <button className="popup-close-button" onClick={() => setModalVisible(false)}>بستن</button>
              <button className="popup-print-button" onClick={printTable}>پرینت</button>
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

  // باز کردن پنجره جدید
  const newWin = window.open('', '_blank', 'width=800,height=600');
  newWin.document.open();
  newWin.document.write(`
    <html>
      <head>
        <title>Print Table</title>
        ${styles}
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
};


function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const response = await fetch('http://localhost:5000/api/chat', {
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

  return (
    <div className='back-root' style={{ backgroundImage: `url(${mainBackground})` }}>
      <div className="chat-container">
        <header className="chat-header">
          <img className='logo-in-header' src={miniLogo} alt="Logo" />
          <p>هوش مصنوعی</p><h1>رایـــزآپ!</h1>
        </header>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <Lottie
                animationData={welcomeAnimation}
                loop={true}
                style={{ opacity: 1 }}
                className='welcome-lottie'
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
  );
}

export default App;
