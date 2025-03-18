import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import Lottie from 'lottie-react';
import './App.css';
// Import your SVG files
import sendIcon from './assets/launch.svg';
import loadingIcon from './assets/more.svg';
import miniLogo from './assets/logo/ru-logo-w.png';
// Import your Lottie animation file
import welcomeAnimation from './assets/bubble.json';

// کامپوننت سفارشی برای مدیریت جدول
const TableWrapper = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <div style={{ display: 'none' }}>
        {children}
      </div>

      <div>
        <table className='preview-table-table'>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Country</th>
          </tr>
          <tr>
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
            <td>Germany</td>
          </tr>
          <tr>
            <td>Centro comercial Moctezuma</td>
            <td>Francisco Chang</td>
            <td>Mexico</td>
          </tr>
          <tr>
            <td>Ernst Handel</td>
            <td>Roland Mendel</td>
            <td>Austria</td>
          </tr>
          <tr>
            <td>Island Trading</td>
            <td>Helen Bennett</td>
            <td>UK</td>
          </tr>
          <tr>
            <td>Laughing Bacchus Winecellars</td>
            <td>Yoshi Tannamuri</td>
            <td>Canada</td>
          </tr>
          <tr>
            <td>Magazzini Alimentari Riuniti</td>
            <td>Giovanni Rovelli</td>
            <td>Italy</td>
          </tr>
        </table>
        <button className='preview-table-button' onClick={() => setModalVisible(true)}>مشاهده جدول</button>
      </div>

      {modalVisible && (
        <div className="lightbox-overlay" onClick={() => setModalVisible(false)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setModalVisible(false)}>بستن</button>
            {children}
          </div>
        </div>
      )}
    </>
  );
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
    <div className='back-root'>
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
                    // استفاده از کامپوننت سفارشی TableWrapper برای رندر جدول‌ها
                    <ReactMarkdown
                      components={{ table: TableWrapper }}
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content || 'اوممم...'}
                    </ReactMarkdown>
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
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <img src={loadingIcon} alt="Loading" width="30" height="30" />
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
