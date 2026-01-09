import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaTimes, FaCommentDots } from 'react-icons/fa';
import { chatAgronomist } from '../api';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'AI', text: "Hello! I'm your AI Agronomist. Ask me anything about your crops!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { sender: 'User', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const data = await chatAgronomist(input);
            const aiMsg = { sender: 'AI', text: data.response };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'AI', text: "Sorry, connection error." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            {/* Chat Window */}
            {isOpen && (
                <div className="glass-panel" style={{ 
                    width: '350px', 
                    height: '500px', 
                    marginBottom: '1rem', 
                    display: 'flex', 
                    flexDirection: 'column',
                    animation: 'slideInUp 0.3s ease-out' 
                }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaRobot color="var(--primary)" />
                            <h4 style={{ margin: 0 }}>AI Agronomist</h4>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <FaTimes />
                        </button>
                    </div>
                    
                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ 
                                display: 'flex', 
                                justifyContent: msg.sender === 'User' ? 'flex-end' : 'flex-start',
                                marginBottom: '0.8rem'
                            }}>
                                <div style={{ 
                                    maxWidth: '85%', 
                                    padding: '0.8rem', 
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    backgroundColor: msg.sender === 'User' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                    color: 'var(--text-main)',
                                    borderBottomRightRadius: msg.sender === 'User' ? '2px' : '12px',
                                    borderTopLeftRadius: msg.sender === 'AI' ? '2px' : '12px',
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} style={{ padding: '0.8rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
                        <input 
                            type="text" 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder="Ask a question..." 
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            disabled={isLoading}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '0.5rem' }} disabled={isLoading}>
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="btn-primary"
                style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
            >
                {isOpen ? <FaTimes /> : <FaCommentDots />}
            </button>
        </div>
    );
};

export default ChatWidget;
