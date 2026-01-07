import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import { chatAgronomist } from '../api';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { sender: 'AI', text: "Hello! I'm your AI Agronomist. Ask me anything about your crops, pests, or soil." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            setMessages(prev => [...prev, { sender: 'AI', text: "Sorry, I'm having trouble connecting to the server." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaRobot color="var(--primary)" size={24} />
                <h3 style={{ margin: 0 }}>AI Agronomist</h3>
            </div>
            
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{ 
                        display: 'flex', 
                        justifyContent: msg.sender === 'User' ? 'flex-end' : 'flex-start',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ 
                            maxWidth: '80%', 
                            padding: '1rem', 
                            borderRadius: '16px',
                            backgroundColor: msg.sender === 'User' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            borderBottomRightRadius: msg.sender === 'User' ? '4px' : '16px',
                            borderTopLeftRadius: msg.sender === 'AI' ? '4px' : '16px',
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                         <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                            Typing...
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Ask about pest control, fertilizers..." 
                    disabled={isLoading}
                />
                <button type="submit" className="btn-primary" disabled={isLoading}>
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
